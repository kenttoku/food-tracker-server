const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fruit: { type: Number, default: 0 },
  vegetable: { type: Number, default: 0 },
  wholeGrain: { type: Number, default: 0 },
  leanProteins: { type: Number, default: 0 },
  nutsAndSeeds: { type: Number, default: 0 },
  dairy: { type: Number, default: 0 },
  refinedGrain: { type: Number, default: 0 },
  fattyProtein: { type: Number, default: 0 },
  sweets: { type: Number, default: 0 },
  friedFood: { type: Number, default: 0 }
});

module.exports = mongoose.model('Food', foodSchema);