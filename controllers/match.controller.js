const Match = require("../models/match");
const Player = require("../models/player");

exports.postMatch = async (msg, regex) => {
  try {
    const pname1 = regex[1];
    const score1 = regex[2];
    const pname2 = regex[3];
    const score2 = regex[4];
    // check that the initiator is one of the two players.
    const player1 = await Player.findOne({ name: pname1 });
    const player2 = await Player.findOne({ name: pname2 });
    console.log("p1: ", player1);
    console.log("p2: ", player2);
    if (!player1 || !player2) return `Could not find one of the players`;
    if (
      !(
        player1.telegram_id == msg.from.id || player2.telegram_id == msg.from.id
      )
    )
      return `You are not authorized to add a match that does not include yourself!`;

    const match = new Match({ player1, player2, score1, score2 });
    await match.save();
    return `Added match successfully!`;
  } catch (err) {
    console.log(err);
    return `Could not add ${name}`;
  }
};

exports.getMatches = async () => {
  try {
    const matches = await Match.find().populate("player1").populate("player2");
    const list = matches.map((m) => printMatch(m)).join("\r\n");
    return `Mathces:\n${list}`;
  } catch (err) {
    console.log(err);
    return `Could not get matches`;
  }
};

const printMatch = (match) => {
  return `${match.player1.name} ${match.score1} - ${match.score2} ${match.player2.name}`;
};

exports.deleteMatch = async () => {};
