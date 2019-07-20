const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/database.config');
const Role = require('../../_helpers/database.role');
const Invitation = db.Invitation;
const ChatList = db.ChatList;
const User = db.User;

    let inviteSend = async (req) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user.id == req.decoded.sub) {
                throw 'some error occured'
            } else {
                if (await Invitation.findOne({sentBy: req.decoded.sub, receivedBy: user.id })) {
                    throw 'Invite already sent'
                } else if (await Invitation.findOne({sentBy: user.id, receivedBy: req.decoded.sub}))  {
                    throw 'Invite already sent'
                } else {
                    const body = {
                        members: [req.decoded.sub, user.id],
                        createdBy: req.decoded.sub,
                        deleted: [],
                        blocked: [],
                        invite: [{accepted: false, id: user.id}],
                        group: false,
                    }
                    const chatList = new ChatList(body);
                    await chatList.save();
                    const invitation = new Invitation({
                        sentBy: req.decoded.sub,
                        receivedBy: user.id,
                        roomId: chatList.id,
                        status: false
                    });
                    await invitation.save();
                    // send email & push notification here
                    return {
                        sentBy: req.decoded.sub,
                        receivedBy: user.id,
                        roomId: chatList.id,
                        status: false,
                    }
                }
            }
        } 
        throw 'No Such User Found';
    }

    let inviteGetAll = async (req) => {
        const InvitationSent = await Invitation.find({ sentBy: req.decoded.sub });
        const InvitationReceived = await Invitation.find({ receivedBy: req.decoded.sub })
        if (InvitationSent) {
            if (InvitationReceived) {
                return {
                    sent: InvitationSent,
                    received: InvitationReceived
                    
                }
            } else {
                return {
                    sent: InvitationSent,  
                    received: []                  
                }
            }
        } else {
            if (InvitationReceived) {
                return {
                    sent: [],
                    received: InvitationReceived
                    
                }
            } else {
                return {
                    sent: [],  
                    received: []                      
                }
            } 
        }
    }

    let inviteAccept = async (req) => {
        const InvitationReceived = await Invitation.findOne({ receivedBy: req.decoded.sub, roomId: req.body.roomId, status: false });
        const chatList = await ChatList.findOne({ _id: req.body.roomId });
        if (InvitationReceived) {
            if(chatList.invite.find(user => user.id == req.decoded.sub)) {
                Object.assign(InvitationReceived, {status: true});
                await InvitationReceived.save();
                const id = chatList.invite.findIndex(user => user.id == req.decoded.sub);
                const list = chatList.invite;
                list[id].accepted = true;
                Object.assign(chatList, list)
                chatList.markModified('invite');
                chatList.save();
                return {
                    InvitationReceived
                }
            }
            throw 'some error occured'
        } 
        throw 'some error occured'
    }

    let chatRoomUpdate = async (req) => { 
        
    }

module.exports = {
    inviteSend: inviteSend,
    inviteGetAll: inviteGetAll,
    inviteAccept: inviteAccept,
    chatRoomUpdate: chatRoomUpdate

};
