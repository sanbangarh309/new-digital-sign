const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title:String,
  user_id:{ type: String, default: '' },
  price:String,
  signed: Number,
  description: String,
  file: String,
  images: [],
  path:String,
  folder_id: { type: String, default: null },
  shared_with: [],
  filethumb: String,
  created_at:{ type: Date, default: Date.now },
});

module.exports = mongoose.model('Docs', schema);
