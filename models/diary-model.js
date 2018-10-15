const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, unique: true },
  entries: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    count: Number
  }],
});

diarySchema.methods.serialize = function() {
  return {
    id: this.id,
    userId: this.userId,
    date: this.date,
    entries: this.entries
  };
};

module.exports = mongoose.model('Diary', diarySchema);