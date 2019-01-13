const mongoose = require('mongoose');
const { combineFood, calculatePoints } = require('../utils/points');

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  yyyymmdd: { type: Number, required: true },
  entries: [{
    food: {
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
      friedFoods: { type: Number, default: 0 },
    },
  }],
});

diarySchema.index({ yyyymmdd: 1, userId: 1 }, { unique: true });

diarySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  },
});

diarySchema.virtual('combined').get(function () {
  return combineFood(this.entries);
});

diarySchema.virtual('points').get(function () {
  return calculatePoints(this.entries);
});

module.exports = mongoose.model('Diary', diarySchema);
