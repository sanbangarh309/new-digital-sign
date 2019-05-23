const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  order: Number,
  email:String,
  signer_id:{ type: String, required: true },
  doc_id:{ type: String, required: true },
  email_sent:{ type: String, default: 'no' },
  link:{ type: String, default: '' },
  status:{ type: String, default: 'pending' },
  created_at:{ type: Date, default: Date.now },
});

module.exports = mongoose.model('Que', schema);
