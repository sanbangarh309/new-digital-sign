const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    logo: String,
    about: String,
    admin_id:String,
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Setting', schema);