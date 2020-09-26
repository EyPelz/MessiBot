const Match = require("../models/match");
const Player = require("../models/player");

exports.getScoreboard = async () => {
  try {
    const players = await Player.find();
    const matches = await Match.find().populate("player1").populate("player2");
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

const createPlayerPairs = (players) => {
  // return [{ player1, score1, player2, score2 }]
  const pairs = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const player1 = players[i];
      const player2 = players[j];
      const pair = {
        player1,
        score1: 0,
        player2,
        score2: 0,
      };
      pairs.push(pair);
    }
  }
  return pairs;
};

const deduceMatchWinner = (match) => {
  if (match.score1 > match.score2) return 1;
  if (match.score2 > match.score1) return 2;
  return 0;
};

const printScoreboardResult = (scoreboardResult) => {
  return `${scoreboardResult.player1.displayName} ${scoreboardResult.score1} - ${scoreboardResult.score2} ${scoreboardResult.player2.displayName}`;
};
