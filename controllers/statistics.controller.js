const match = require("../models/match");
const Match = require("../models/match");
const Player = require("../models/player");
const matchController = require("./match.controller");

exports.getMyNumOfGoals = async (telegram_id) => {
  try {
    const players = await Player.find({ telegram_id: { $ne: telegram_id } });
    const myMatches = await matchController.myMatches(telegram_id);
    const numGoals = [];

    if (!myMatches) throw new Error();
    const scoreboard = createPlayerPairs(players);
    // console.log(scoreboard);
    matches.forEach((match) => {
      //   console.log(match);
      const result = scoreboard.find(
        (r) =>
          r.player1.telegram_id === match.player1.telegram_id &&
          r.player2.telegram_id === match.player2.telegram_id
      );
      //   console.log(result);
      const winner = deduceMatchWinner(match);
      if (winner === 1) {
        result.score1++;
      } else if (winner === 2) {
        result.score2++;
      }
    });
    const scoreboardString = scoreboard
      .map((r) => printScoreboardResult(r))
      .join("\r\n");
    return `Scoreboard:\n${scoreboardString}`;
  } catch (err) {
    console.log(err);
    return "Could not get scoreboard";
  }
};
