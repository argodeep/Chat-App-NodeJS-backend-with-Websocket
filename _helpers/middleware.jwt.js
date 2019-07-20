const config = require('../config.json');
const auth = require('jsonwebtoken');
const userService = require('../app/users/user.service');

let jwt = async (req, res, next) => {
    const publicPath = [
        '/users/login',
        '/users/signup',
        '/forgot-password',
        '/ws',
        '/wss',
        '/'
    ]
    if (publicPath.indexOf(req.path) === -1) {
        const token = req.header('x-access-token');
        if (token) {
            const user = await userService.profileFetch(req);
            if (!user) {
                return res.status(403).send({
                    "error": true,
                    "message": 'Unauthorzied access'
                });
            } else {
                next();
            }
          } else {
            return res.status(403).send({
                "error": true,
                "message": 'Unauthorzied access'
            });
        }
    } else {
        next(); 
    }
};

module.exports = jwt;