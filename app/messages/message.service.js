const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/database.config');
const Role = require('../../_helpers/database.role');
const WebSocket = require('ws');
const socket = 8080;
const Message = db.Message;
const User = db.User;
const ChatList = db.ChatList;
const Invitation = db.Invitation;
const clients = [];

    
    // Web Socket Connection
    const wss = new WebSocket.Server({ port: socket })
    wss.on('connection', async ws => {
        ws.on('message', async message => {
            let req = JSON.parse(message);
            const token = await req.token;
            if (await token) {
                jwt.verify(token, config.secret, async function(err, decoded) {
                    if(err) {
                        return null
                    }
                    req.decoded = decoded;
                })
                if (req.decoded != undefined) {
                    const user = await User.findById({ _id: req.decoded.sub, role: req.decoded.role });
                    // Do All Auhtenticated Operation Below
                    if (user) {
                        // Get Messages
                        if (req.type === 'GET' && req.segment === 'messages') {
                            const messages = await Message.find({ roomId: req.roomId }).sort('-createdAt');
                            const chat = await ChatList.findOne({ _id: req.roomId })
                            ws.roomId = req.roomId;
                            ws.uid = req.decoded.sub;
                            if (messages.length > 0 && chat.members.indexOf(req.decoded.sub) !== -1) {
                                ws.send(JSON.stringify({
                                    chat: messages
                                }));
                            } else {
                                if (await ChatList.findOne({ _id: req.roomId })) {
                                    ws.send(JSON.stringify({
                                        message: 'No Messages'
                                    }));
                                } else {
                                    ws.roomId = null;
                                    ws.send(JSON.stringify({
                                        message: 'Unauthorzied access'
                                    }));
                                }
                            }
                        }
                        
                        // Send Message
                        if (req.type === 'POST' && req.segment === 'sendMessage') {
                            const invite = await Invitation.findOne({ roomId: req.roomId });
                            const chat = await ChatList.findOne({ _id: req.roomId })
                            if (invite && invite.status == true && req.to != req.decoded.sub) {
                                const message = new Message(req);
                                message.from = req.decoded.sub;
                                message.hide = [...new Set([...chat.deleted,...chat.deleted])]
                                delete message.segment;
                                delete message.type;
                                delete message.token;
                                await message.save();
                                const { __v, updatedAt, id, ...data } = message.toObject();
                                const messages = await Message.find({ roomId: req.roomId }).sort('-createdAt');
                                wss.clients.forEach(client => {
                                    if (client.roomId === req.roomId && chat.members.indexOf(client.uid) !== -1) {
                                        client.send(JSON.stringify({
                                            chat: messages
                                        }));
                                    }
                                });
                            } else {
                                ws.send(JSON.stringify({
                                    message: 'invalid request'
                                }));
                            }
                        }
                    }
                } else {
                    ws.roomId = null;
                    ws.send(JSON.stringify({
                        message: 'Unauthorzied access'
                    }));
                }
            } else {
                ws.roomId = null;
                ws.send(JSON.stringify({
                    message: 'Unauthorzied access'
                }));
            }
        });
    })

    let sendMesssage = async (req) => {
        const invite = await Invitation.findOne({ roomId: req.body.roomId });
        const chat = await ChatList.findOne({ _id: req.body.roomId })
        if (invite && invite.status == true && req.body.to != req.decoded.sub) {
            const message = new Message(req.body);
            message.from = req.decoded.sub;
            message.hide = [...new Set([...chat.deleted,...chat.deleted])]
            await message.save();
            const { __v, updatedAt, id, ...data } = message.toObject();
            return {
               ...data
            }
        } else {
            throw 'invalid request'
        }
    }

    let getMesssages = async (req) => {
        const messages = await Message.find({ roomId: req.body.roomId }).sort('-createdAt');
        return {
            messages
        }
    }

module.exports = {
   sendMesssage: sendMesssage,
   getMesssages: getMesssages
};
