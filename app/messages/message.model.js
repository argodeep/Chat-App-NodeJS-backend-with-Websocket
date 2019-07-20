const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: { 
        type: Array, 
        required: true,
    },
    body: {
        type: Object,
        required: true,
    },
    hide: {
        type: Array,
        required: true,
    },
    roomId: { 
        type: String, 
        required: true,
    },
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Message', schema);