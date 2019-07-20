const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/database.config');
const Role = require('../../_helpers/database.role');
const User = db.User;

    let login = async (req) => {
        const user = await User.findOne({ email: req.body.email });
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, { expiresIn: config.tokenLife});
            const bearerToken = jwt.sign({ sub: user.id, role: user.role }, config.bearerTokenSecret, { expiresIn: config.bearerTokenLife})
            Object.assign(user, {bearerToken: bearerToken});
            await user.save();
            return {
                _id: user.id,
                email: user.email,
                name: user.name,
                token,
                bearerToken
            };
        }
    }

    let signup = async (req) => {
        if (await User.findOne({ email: req.body.email })) {
            throw 'This Email Address Is Not allowed For Registration Either Disabled or Blacklisted';
        }
        const user = new User(req.body);
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 10);
            user.role = Role.User;
        }
        await user.save();
    }

    let token = async (req) => {
        const bearerToken = req.header('x-bearer-token');
        if (bearerToken) {
            jwt.verify(bearerToken, config.bearerTokenSecret, async function(err, valid) {
                if(err) {
                    throw 'Invalid Token';
                }
                req.bearer = valid;
            })
            if (req.bearer != undefined) {
                    const user = await User.findById({ _id: req.decoded.sub, role: req.decoded.role });
                    if (user && user.bearerToken == bearerToken) {
                        const newToken = await jwt.sign({ sub: req.decoded.sub, role: user.role }, config.secret, { expiresIn: config.tokenLife})
                        return {
                            token: newToken,
                        };  
                    } else {
                        throw 'Invalid request';
                    }
            } else {
                throw 'Invalid Token';
            }
        } else {
            throw 'Invalid request';
        }
        
    }

    let profileFetch = async (req) => {
        const token = req.header('x-access-token');
        jwt.verify(token, config.secret, async function(err, decoded) {
            if(err) {
                return null
            }
            req.decoded = decoded;
        })
        if (req.decoded != undefined) {
            const user = await User.findById({ _id: req.decoded.sub, role: req.decoded.role });
            if (user) {
                const { __v, updatedAt, bearerToken, password, ...data } = user.toObject();
                return {     
                    ...data     
                }
            }
        }
    }


    let profileUpdate = async (req) => {
            const user = await User.findById({ _id: req.decoded.sub, role: req.decoded.role });
            if (user) {
                if (req.body.email != user.email) {
                    if (await User.findOne({ email: req.body.email }))  {
                        throw 'This email is already taken'
                    } 
                    const body = {
                        requestedEmail: req.body.email,
                        email: user.email,
                        __v: user.__v + 1
                    }
                    Object.assign(user, body);
                    // Send Email Change Email
                    delete req.body.email;
                    Object.assign(user, req.body);
                    await user.save();
                    const { __v, updatedAt, bearerToken, password, ...data } = user.toObject();
                    return {     
                        ...data     
                    }
                } else {
                    user.set('requestedEmail', undefined, {strict: false} );
                    const body = {
                        __v: user.__v + 1
                    }
                    Object.assign(user, body);
                    Object.assign(user, req.body);
                    await user.save();
                    const { __v, updatedAt, bearerToken, password, ...data } = user.toObject();
                    return {     
                        ...data     
                    }
                }
        }
    }

// async function forgotPassword({ username, password }) {
//     const user = await User.findOne({ username });
//     if (user && bcrypt.compareSync(password, user.hash)) {
//         const { hash, ...userWithoutHash } = user.toObject();
//         const token = jwt.sign({ sub: user.id }, config.secret);
//         return {
//             ...userWithoutHash,
//             token
//         };
//     }
// }

// async function getAll() {
//     return await User.find().select('-hash');
// }


// async function _delete(id) {
//     await User.findByIdAndRemove(id);
// }

module.exports = {
    login: login,
    signup: signup,
    token: token,
    profileFetch: profileFetch,
    profileUpdate: profileUpdate,
    // forgotPassword: forgotPassword
    // getAll,
    // delete: _delete
};
