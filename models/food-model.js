const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
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

foodSchema.set('timestamps', true);

foodSchema.set('toObject', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

foodSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Food', foodSchema);