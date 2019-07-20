const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    sentBy: {
        type: String, 
        required: true
    },
    receivedBy: {
        type: String, 
        required: true
    },
    roomId: {
        type: String, 
        required: true,
        unique: true
    },
    status: {
        type: Boolean, 
        required: true
    },    
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Invitation', schema);