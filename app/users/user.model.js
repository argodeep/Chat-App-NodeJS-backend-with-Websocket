const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    requestedEmail: { 
        type: String, 
        minlength: 5,
        maxlength: 255
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    bearerToken: { 
        type: String, 
    },
    role: {
        type: String, 
    },
    headline: { 
        type: String, 
    },
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);