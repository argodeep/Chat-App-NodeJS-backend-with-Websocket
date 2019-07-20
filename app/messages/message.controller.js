const express = require('express');
const router = express.Router();
const messageService = require('./message.service');

    let sendMesssage = (req, res, next) => {
        messageService.sendMesssage(req)
            .then(message => message ? res.json(message) : res.status(400).json({ message: 'some error occured' }))
            .catch(err => next(err));
    }

    let getMesssages = (req, res, next) => {
        messageService.getMesssages(req)
            .then(message => message ? res.json(message) : res.status(400).json({ message: 'some error occured' }))
            .catch(err => next(err));
    }

    // routes
    router.get('/', getMesssages);
    router.post('/send', sendMesssage);
    // router.put('/edit', editMessage);
    // router.delete('/delete', deleteMessage);

    module.exports = router;