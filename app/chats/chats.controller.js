const express = require('express');
const router = express.Router();
const chatsService = require('./chats.service');
    
    let inviteSend = (req, res, next) => {
        chatsService.inviteSend(req)
            .then(chatRoom => chatRoom ? res.json(chatRoom) : res.status(400).json({ message: 'some error occured' }))
            .catch(err => next(err));
    }
     
    let inviteGetAll = (req, res, next) => {
        chatsService.inviteGetAll(req)
            .then(chatRoom => chatRoom ? res.json(chatRoom) : res.status(400).json({ message: 'some error occured' }))
            .catch(err => next(err));
    }

    let inviteAccept = (req, res, next) => {
        chatsService.inviteAccept(req)
            .then(chatRoom => chatRoom ? res.json(chatRoom) : res.status(400).json({ message: 'some error occured' }))
            .catch(err => next(err));
    }

    let chatRoomUpdate = (req, res, next) => {
        chatsService.chatRoomUpdate(req)
            .then(chatRoom => chatRoom ? res.json(chatRoom) : res.status(400).json({ message: 'some error occured' }))
            .catch(err => next(err));
    }


    // routes
    router.post('/invite', inviteSend);
    router.get('/invite', inviteGetAll);
    router.put('/invite', inviteAccept);
    router.put('/chatRoomUpdate', chatRoomUpdate);
    // router.post('/messageSend', sendMesssage);
    // router.put('/messageEdit', editMessage);
    // router.delete('/messageDelete', deleteMessage);
    module.exports = router;