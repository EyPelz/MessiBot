const Player = require("../models/player");

const stringifyExceptions = ["telegram_id", "_id", "__v"];

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

exports.getPlayers = async () => {
  try {
    const players = await Player.find();
    const list = players.map((p) => toTitleCase(p.name)).join("\r\n");
    return `Players currently in the database:\n${list}`;
  } catch (err) {
    console.log(err);
    return;
  }
};

exports.getMe = async (telegram_id) => {
  try {
    const player = await Player.find({ telegram_id });
    if (!player) {
      return `You are not registered in the database`;
    }
    return stringifyObj(player, stringifyExceptions);
  } catch (err) {
    console.log(err);
    return;
  }
};

const stringifyObj = (jsonObj, exceptions) => {
  const arr = [];
  const keys = Object.keys(jsonObj[0]);
  console.log(keys);
  for (const key of keys) {
    if (exceptions.includes(key)) continue;
    arr.push(`${key}: ${jsonObj[key]}`);
  }
  return arr.join("\r\n");
};

exports.postPlayer = async (name, telegram_id) => {
  try {
    name = name.toLowerCase();
    const player = new Player({ name, telegram_id });
    await player.save();
    return `Added ${name} successfully!`;
  } catch (err) {
    console.log(err);
    return `Could not add ${name}`;
  }
};

exports.deletePlayer = async function (telegram_id) {
  try {
    const player = await Player.findOneAndDelete({ telegram_id });
    if (!player) {
      const err = new Error("Player not found");
      err.statusCode = 404;
      console.log(err);
      return;
    }
    // await player.remove();
    return `Player ${player.name} deleted`;
  } catch (err) {
    console.log(err);
    return;
  }
};

exports.superDeletePlayer = async function (name) {
  name = name.toLowerCase();
  try {
    const player = await Player.findOneAndDelete({ name });
    if (!player) {
      const err = new Error("Player not found");
      err.statusCode = 404;
      console.log(err);
      return;
    }
    // await player.remove();
    return `Player ${player.name} deleted`;
  } catch (err) {
    console.log(err);
    return;
  }
};
