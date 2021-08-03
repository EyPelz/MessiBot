const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    player1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    player2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    score1: {
      type: Number,
      required: true,
    },
    score2: {
      type: Number,
      required: true,
    },
    season: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
