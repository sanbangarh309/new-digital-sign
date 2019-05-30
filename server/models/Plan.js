const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    trial_dur: { type: String, required: true },
    trial_type: { type: String, required: true },
    plan_dur: { type: String, required: true },
    plan_type: { type: String, required: true },
    content: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Plan', schema);