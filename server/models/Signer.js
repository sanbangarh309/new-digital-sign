const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:{ type: String, required: true },
  email:{ type: String, default: '' },
  shared_with: [],
  created_at:{ type: Date, default: Date.now },
});

module.exports = mongoose.model('Signer', schema);