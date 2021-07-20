const Match = require("../models/match");
const Player = require("../models/player");
const cTable = require("console.table");

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

/* ------------------------------ TABLE ------------------------------ */
const uppercaseObjKeys = (table) => {
  const upperTable = table.map((tr) => {
    for (var key in tr) {
      var upper = key.toUpperCase();
      // check if it already wasn't uppercase
      if (upper !== key) {
        tr[upper] = tr[key];
        delete tr[key];
      }
    }
    return tr;
  });
  return upperTable;
};

const getTable = async () => {
  // for each player:
  const players = await Player.find();
  const table = players.map((p) => {
    return {
      telegram_id: p.telegram_id,
      name: p.displayName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    };
  });
  const matches = await Match.find().populate("player1").populate("player2");
  matches.forEach((match) => {
    const winnerId = matchWinner(match);
    const p1 = table.find((p) => p.telegram_id === match.player1.telegram_id);
    const p2 = table.find((p) => p.telegram_id === match.player2.telegram_id);
    if (!winnerId) {
      p1.drawn++;
      p2.drawn++;
    } else if (winnerId === p1.telegram_id) {
      p1.won++;
      p2.lost++;
    } else {
      p1.lost++;
      p2.won++;
    }
    p1.gf += match.score1;
    p1.ga += match.score2;
    p2.gf += match.score2;
    p2.ga += match.score1;
  });
  players.forEach((player) => {
    const tableRow = table.find((p) => p.telegram_id === player.telegram_id);
    tableRow.played = tableRow.won + tableRow.drawn + tableRow.lost;
    tableRow.gd = tableRow.gf - tableRow.ga;
    tableRow.points = tableRow.won * 3 + tableRow.drawn;
  });
  table.sort((r1, r2) => {
    if (r1.points > r2.points) return -1;
    if (r1.points < r2.points) return 1;
    if (r1.points === r2.points) {
      if (r1.gd > r2.gd) return -1;
      if (r1.gd < r2.gd) return 1;
      return 0;
    }
  });
  table.forEach((tr) => delete tr.telegram_id);
  return uppercaseObjKeys(table);
};

exports.getTable = async () => {
  const table = await getTable();
  const consoledTable = cTable.getTable(table);
  return `<pre>${consoledTable}</pre>`;
};
/* ------------------------------ TABLE ------------------------------ */
