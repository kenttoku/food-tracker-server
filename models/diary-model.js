const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  yyyymmdd:  { type: Number, required: true, unique: true },
  entries: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    servings: Number,
    meal: String
  }],
});

diarySchema.methods.serialize = function() {
  return {
    id: this.id,
    userId: this.userId,
    yyyymmdd: this.yyyymmdd,
    entries: this.entries
  };
};

module.exports = mongoose.model('Diary', diarySchema);