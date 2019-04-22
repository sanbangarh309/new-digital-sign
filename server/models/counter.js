const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Counter', schema);
