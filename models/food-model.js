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

foodSchema.methods.serialize = function() {
  return {
    id: this.id,
    name: this.name,
    userId: this.userId,
    fruits: this.fruits,
    vegetables: this.vegetables,
    wholeGrains: this.wholeGrains,
    leanProteins: this.leanProteins,
    nutsAndSeeds: this.nutsAndSeeds,
    dairy: this.dairy,
    refinedGrains: this.refinedGrains,
    fattyProteins: this.fattyProteins,
    sweets: this.sweets,
    friedFoods: this.friedFoods
  };
};

module.exports = mongoose.model('Food', foodSchema);