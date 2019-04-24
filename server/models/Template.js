const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:{ type: String, required: true },
  user_id:{ type: String, default: '' },
  path: { type: String, default: '' },
  type:{ type: String, required: true },
  images:[],
  created_at:{ type: Date, default: Date.now },
});

module.exports = mongoose.model('Template', schema);