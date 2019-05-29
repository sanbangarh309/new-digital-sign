const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Guest', schema);
