const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  telegram_id: {
    type: Number,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Player", playerSchema);
