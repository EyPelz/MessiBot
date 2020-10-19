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

exports.removeTemp = removeTemp;

const createExitOption = (o_id) => {
  return {
    text: "Exit",
    callback_data: JSON.stringify({
      answer: "Exit",
      o_id,
    }),
  };
};

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
        inline_keyboard: [names, [createExitOption(id)]],
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
        inline_keyboard: [
          inline_keyboard.splice(0, 6),
          inline_keyboard,
          [createExitOption(o_id)],
        ],
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
        inline_keyboard: [
          inline_keyboard.splice(0, 6),
          inline_keyboard,
          [createExitOption(o_id)],
        ],
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
    console.log("in getMatches");
    const matches = await Match.find().populate("player1").populate("player2");
    if (matches.length === 0) return `There are no recorded matches yet.`;
    const list = matches.map((m) => printMatch(m)).join("\r\n");
    return `Matches:\n${list}`;
  } catch (err) {
    console.log(err);
    return `Could not get matches`;
  }
};

/**
 * Finds the user related matches and returns them as an array.
 * @param {*} telegram_id my id
 */
const myMatches = async (telegram_id) => {
  try {
    let matches = await Match.find().populate("player1").populate("player2");
    matches = matches.filter(
      (m) =>
        m.player1.telegram_id === telegram_id ||
        m.player2.telegram_id === telegram_id
    );
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.myMatches = myMatches;

exports.getMyMatches = async (telegram_id) => {
  try {
    let matches = await myMatches(telegram_id);
    if (!matches) throw new Error("");
    if (matches.length === 0) return `You haven't played yet.`;
    const list = matches.map((m) => printMatch(m)).join("\r\n");
    return `Matches:\n${list}`;
  } catch (err) {
    console.log(err);
    return `Could not get your matches`;
  }
};

const printMatch = (match) => {
  return `${match.player1.displayName} ${match.score1} - ${match.score2} ${match.player2.displayName}`;
};

exports.deleteMatch = async () => {};
