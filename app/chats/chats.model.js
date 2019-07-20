const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    members: {
        type: Array,
        required: true,
        unique: false
    },
    createdBy: { 
        type: String, 
        required: true,
        unique: false
    },
    deleted: {
        type: Array,
        required: true,
        unique: false
    },
    blocked: {
        type: Array,
        required: true,
        unique: false
    },
    invite: { 
        type: Array, 
        required: true,
        unique: false
    },
    group: {
        type: Boolean, 
        required: true,
        unique: false
    },    
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: false });

module.exports = mongoose.model('ChatList', schema);