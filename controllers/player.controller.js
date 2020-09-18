const Player = require("../models/player");

exports.getPlayers = async (req, res, next) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    next(err);
  }
};

exports.postPlayer = async (req, res, next) => {
  try {
    const name = req.body.name;
    const player = new Player(name);
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    next(err);
  }
};

exports.deletePlayer = async function (req, res, next) {
  try {
    player = await Player.findById(req.params.id);
    if (!player) {
      const err = new Error("Player not found");
      err.statusCode = 404;
      next(err);
    }
    await player.remove();
    res.status(200).json("Player deleted");
  } catch (err) {
    next(err);
  }
};
