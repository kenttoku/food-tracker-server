const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fruits: { type: Number, default: 0 },
  vegetables: { type: Number, default: 0 },
  wholeGrains: { type: Number, default: 0 },
  leanProteins: { type: Number, default: 0 },
  nutsAndSeeds: { type: Number, default: 0 },
  dairy: { type: Number, default: 0 },
  refinedGrains: { type: Number, default: 0 },
  fattyProteins: { type: Number, default: 0 },
  sweets: { type: Number, default: 0 },
  friedFoods: { type: Number, default: 0 }
});

module.exports = mongoose.model('Food', foodSchema);