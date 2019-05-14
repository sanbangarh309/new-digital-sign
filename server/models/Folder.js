const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    user_id: { type: String, required: true },
    docs: [],
    path: { type: String, default: '' },
    created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Folder', schema);
