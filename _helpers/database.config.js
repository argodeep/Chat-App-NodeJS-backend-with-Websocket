const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true })
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../app/users/user.model'),
    ChatList: require('../app/chats/chats.model'),
    Invitation: require('../app/chats/invite.model'),
    Message: require('../app/messages/message.model')
};