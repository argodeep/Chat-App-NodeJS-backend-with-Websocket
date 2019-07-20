const express = require('express');
const router = express.Router();
const userService = require('./user.service');

    let login = (req, res, next) => {
        userService.login(req)
            .then(user => user ? res.json(user) : res.status(400).json({ message: 'email or password is incorrect' }))
            .catch(err => next(err));
    }

    let signup = (req, res, next) => {
        userService.signup(req)
            .then(() => {
                userService.login(req)
                .then(user => user ? res.json(user) : res.status(400).json({ message: 'email or password is incorrect' }))
                .catch(err => next(err));
            })
            .catch(err => next(err));
    }

    let token = (req, res, next) => {
        userService.token(req)
            .then((token) => res.json(token))
            .catch(err => next(err));
    }

    let profileFetch = (req, res, next) => {
        userService.profileFetch(req)
            .then(user => user ? res.json(user) : res.status(401).json({ message: 'Not Found' }))
            .catch(err => next(err));
    }

    let profileUpdate = (req, res, next) => {
        userService.profileUpdate(req)
            .then((users) => res.json({users}))
            .catch(err => next(err));
    }

    // let forgotPassword = (req, res, next) => {
    //     userService.create(req.body)
    //         .then(() => res.json({}))
    //         .catch(err => next(err));
    // }


    // function _delete(req, res, next) {
    //     userService.delete(req.params.id)
    //         .then(() => res.json({}))
    //         .catch(err => next(err));
    // }


    // routes
    router.post('/login', login);
    router.post('/signup', signup);
    router.post('/token', token);
    router.get('/profile', profileFetch);
    router.put('/profile', profileUpdate);
    // router.post('/forgot-password', forgotPassword);
    // router.delete('/:id', _delete);

    module.exports = router;