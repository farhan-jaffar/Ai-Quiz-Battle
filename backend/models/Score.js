const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast leaderboard queries (descending score)
scoreSchema.index({ score: -1 });

module.exports = mongoose.model('Score', scoreSchema);
