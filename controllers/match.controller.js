const Match = require("../models/match");
const Player = require("../models/player");

exports.getMatches = async (req, res, next) => {
  try {
    const matches = await Match.find();
    res.status(200).json(matches);
  } catch (err) {
    next(err);
  }
};

exports.postMatch = async (req, res, next) => {
  try {
    const score1 = req.body.score1;
    const score2 = req.body.score2;
    const pname1 = req.body.pname1;
    const pname2 = req.body.pname2;
    const player1 = await Player.find({ name: pname1 }).exec();
    const player2 = await Player.find({ name: pname2 }).exec();
    if (!player1) {
      const err = new Error(`Player ${pname1} not found`);
      err.statusCode = 404;
      next(err);
    }
    if (!player2) {
      const err = new Error(`Player ${pname2} not found`);
      err.statusCode = 404;
      next(err);
    }
    const match = new Match({
      score1,
      score2,
      player1: player1._id,
      player2: player2._id,
    });
    const newMatch = await match.save();
    res.status(201).json(newMatch);
  } catch (err) {
    next(err);
  }
};
