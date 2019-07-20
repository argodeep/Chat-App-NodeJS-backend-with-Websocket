require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/middleware.jwt');
const errorHandler = require('./_helpers/middleware.error');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt);

// api routes
app.use('/users', require('./app/users/user.controller'));
app.use('/chats', require('./app/chats/chats.controller'));
app.use('/messages', require('./app/messages/message.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = 3000;
// const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

app.get('/ws', function(req, res){
    res.sendFile(__dirname + '/ws.html');
});

app.get('/wss', function(req, res){
    res.sendFile(__dirname + '/wss.html');
});