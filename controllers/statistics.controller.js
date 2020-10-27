const Player = require("../models/player");
const matchController = require("./match.controller");

const initializeGoalStatus = (againstPlayer) => {
  return {
    against: againstPlayer,
    gf: 0,
    ga: 0,
    gd: 0,
  };
};

const printGoalStatus = (goalStatus) => {
  return `${goalStatus.against.displayName}:  GF - (${goalStatus.gf}) | GA - (${goalStatus.ga}) | GD - (${goalStatus.gd})`;
};

/**
 * Creates a goalStatus against the player.
 * @param {*} myMatches All of the matches I played
 * @param {*} againstPlayer The player to search for.
 */
const goalStatus = (myMatches, againstPlayer) => {
  const goalStatus = initializeGoalStatus(againstPlayer);
  // get the matches with againstPlayer
  againstPlayerMatches = myMatches.filter(
    (match) =>
      match.player1.telegram_id === againstPlayer.telegram_id ||
      match.player2.telegram_id === againstPlayer.telegram_id
  );
  againstPlayerMatches.forEach((match) => {
    let againstPlayerScore = 0;
    let myScore = 0;
    if (match.player1.telegram_id === againstPlayer.telegram_id) {
      againstPlayerScore = match.score1;
      myScore = match.score2;
    } else {
      againstPlayerScore = match.score2;
      myScore = match.score1;
    }
    goalStatus.ga += againstPlayerScore;
    goalStatus.gf += myScore;
    goalStatus.gd = goalStatus.gf - goalStatus.ga;
  });
  return goalStatus;
};

/**
 * Create a goal status for total goals
 * @param {*} goalStatuses a goal status array
 */
const totalGoalStatus = (goalStatuses) => {
  let totGF = 0;
  let totGA = 0;
  goalStatuses.forEach((gs) => {
    totGF += gs.gf;
    totGA += gs.ga;
  });
  const totGD = totGF - totGA;
  return {
    against: { displayName: "Total" },
    ga: totGA,
    gf: totGF,
    gd: totGD,
  };
};

exports.getMyGoalStatistics = async (telegram_id) => {
  try {
    const thisPlayer = await Player.findOne({ telegram_id });
    const players = await Player.find({ telegram_id: { $ne: telegram_id } });
    const myMatches = await matchController.myMatches(telegram_id);

    const goalStatuses = [];
    players.forEach((player) => {
      goalStatuses.push(goalStatus(myMatches, player));
    });
    // add total line
    goalStatuses.push(totalGoalStatus(goalStatuses));
    // create message
    const legend = `* GF - Goals For | GA - Goals Against | GD - Goals Difference *\n`;
    const title = `Goals statistics for ${thisPlayer.displayName}:\n\n`;
    const goalStatistics = goalStatuses
      .map((goalStatus) => printGoalStatus(goalStatus))
      .join("\n\n");
    const message = legend + title + goalStatistics;
    return message;
  } catch (err) {
    console.log(err);
    return "Could not get your goal statistics";
  }
};
