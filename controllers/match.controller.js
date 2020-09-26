const Match = require("../models/match");
const Player = require("../models/player");
const commands = require("../models/command");

let temps = []; // save temporary matches (while in conversation)
const goalsRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const generateTempNumber = () => {
  const num = Math.floor(Math.random() * 100) + 1;
  const existingNumbers = temps.map((t) => t.id);
  while (existingNumbers.includes(num)) {
    num = Math.floor(Math.random() * 100) + 1;
  }
  return num;
};

const addTemp = (obj) => {
  const id = generateTempNumber();
  obj["id"] = id;
  temps.push(obj);
  return id;
};

const getTemp = (id) => {
  return temps.find((obj) => obj.id === id);
};

const removeTemp = (id) => {
  temps = temps.filter((obj) => obj.id !== id);
};

// exports.postMatch = async (msg, regex) => {
//   try {
//     const pname1 = regex[1];
//     const score1 = regex[2];
//     const pname2 = regex[3];
//     const score2 = regex[4];
//     // check that the initiator is one of the two players.
//     const player1 = await Player.findOne({ name: pname1 });
//     const player2 = await Player.findOne({ name: pname2 });
//     console.log("p1: ", player1);
//     console.log("p2: ", player2);
//     if (!player1 || !player2) return `Could not find one of the players`;
//     if (
//       !(
//         player1.telegram_id == msg.from.id || player2.telegram_id == msg.from.id
//       )
//     )
//       return `You are not authorized to add a match that does not include yourself!`;

//     const match = new Match({ player1, player2, score1, score2 });
//     await match.save();
//     return `Added match successfully!`;
//   } catch (err) {
//     console.log(err);
//     return `Could not add ${name}`;
//   }
// };

// Post match (START) ------------------------------------------------------------

/**
 * Saves player1 and asks about player2 identity.
 * @param {*} msg The initial msg, player1 is inferred by it.
 */
exports.postMatchPlayer1 = async (msg) => {
  try {
    const playerTeleId = msg.from.id;
    const player1 = await Player.findOne({ telegram_id: playerTeleId });
    const obj = { player1 };
    const id = addTemp(obj);
    const players = await Player.find({ telegram_id: { $ne: playerTeleId } });
    const names = players.map((p) => {
      return {
        text: p.displayName,
        callback_data: JSON.stringify({
          command: commands.postMatchPlayer1,
          answer: p.telegram_id,
          o_id: id,
        }),
      };
    });
    return {
      reply_markup: {
        inline_keyboard: [names],
      },
    };
  } catch (err) {
    console.log(err);
  }
};
/**
 * Saves player2 and asks player1 how much he scored.
 * @param {Number} telegram_id Telegram Id of player2
 * @param {*} o_id The id of the temp match object.
 */
exports.postMatchPlayer2 = async (telegram_id, o_id) => {
  try {
    const player2 = await Player.findOne({ telegram_id });
    const obj = getTemp(o_id);
    obj["player2"] = player2;
    const inline_keyboard = goalsRange.map((num) => {
      return {
        text: num,
        callback_data: JSON.stringify({
          command: commands.postMatchPlayer2,
          answer: num,
          o_id,
        }),
      };
    });
    return {
      reply_markup: {
        // Splicing the array results in two lines of keyboard buttons.
        inline_keyboard: [inline_keyboard.splice(0, 6), inline_keyboard],
      },
    };
  } catch (err) {
    console.log(err);
  }
};

/**
 * Saves player1 goals and asks how much player2 scored.
 * @param {Number} player1_goals
 * @param {*} o_id The id of the temp match object.
 */
exports.postMatchGoalsPlayer1 = async (player1_goals, o_id) => {
  try {
    const obj = getTemp(o_id);
    obj["score1"] = player1_goals;
    const inline_keyboard = goalsRange.map((num) => {
      return {
        text: num,
        callback_data: JSON.stringify({
          command: commands.postMatchGoalsPlayer1,
          answer: num,
          o_id,
        }),
      };
    });
    const reply_markup = {
      reply_markup: {
        // Splicing the array results in two lines of keyboard buttons.
        inline_keyboard: [inline_keyboard.splice(0, 6), inline_keyboard],
      },
    };
    return {
      reply_markup,
      p2name: obj.player2.displayName,
    };
  } catch (err) {
    console.log(err);
  }
};

/**
 * Saves player2 goals and saves the match.
 * @param {Number} player2_goals
 * @param {*} o_id The id of the temp match object.
 */
exports.postMatchGoalsPlayer2 = async (player2_goals, o_id) => {
  try {
    const obj = getTemp(o_id);
    obj["score2"] = player2_goals;
    const match = new Match(obj);
    await match.save();
    removeTemp(o_id);
    return `Saved match:\n${printMatch(match)}`;
  } catch (err) {
    console.log(err);
  }
};

// Post match (END) ------------------------------------------------------------

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
  return `${match.player1.displayName} ${match.score1} - ${match.score2} ${match.player2.displayName}`;
};

exports.deleteMatch = async () => {};
