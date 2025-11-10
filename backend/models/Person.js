const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Person', personSchema);
