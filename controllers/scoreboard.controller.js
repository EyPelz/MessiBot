const Match = require("../models/match");
const Player = require("../models/player");

exports.getScoreboard = async () => {
  try {
    const players = await Player.find();
    const matches = await Match.find().populate("player1").populate("player2");
    const scoreboard = initializeScoreboard(players);
    // console.log(scoreboard);
    matches.forEach((match) => {
      //   console.log(match);
      // finds the pair of players in the scoreboard, based on the match.
      const pair = scoreboard.find(
        (p) =>
          (p.player1.telegram_id === match.player1.telegram_id &&
            p.player2.telegram_id === match.player2.telegram_id) ||
          (p.player1.telegram_id === match.player2.telegram_id &&
            p.player2.telegram_id === match.player1.telegram_id)
      );
      increaseWinnerScore(matchWinner(match), pair);
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

const initializeScoreboard = (players) => {
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

/**
 * Returns the telegram_id of the match winner. Otherwise, returns null.
 * @param {*} match The match to deduce the winner from
 */
const matchWinner = (match) => {
  if (match.score1 > match.score2) return match.player1.telegram_id;
  if (match.score2 > match.score1) return match.player2.telegram_id;
  return null;
};

const increaseWinnerScore = (winnerId, pair) => {
  if (!winnerId) return;
  if (pair.player1.telegram_id === winnerId) pair.score1++;
  if (pair.player2.telegram_id === winnerId) pair.score2++;
};

const printScoreboardResult = (scoreboardResult) => {
  return `${scoreboardResult.player1.displayName} ${scoreboardResult.score1} - ${scoreboardResult.score2} ${scoreboardResult.player2.displayName}`;
};
