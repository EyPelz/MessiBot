const Player = require("../models/player");
const protection = process.env.PROTECT === "true";

const stringifyExceptions = ["telegram_id", "_id", "__v"];

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

exports.getPlayers = async () => {
  try {
    // do nothing if protection is on
    if (protection) {
      return "Player protection is on. There is nothing to do.";
    }
    const players = await Player.find();
    const list = players.map((p) => p.displayName).join("\r\n");
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
  // console.log(keys);
  for (const key of keys) {
    if (exceptions.includes(key)) continue;
    arr.push(`${key}: ${jsonObj[key]}`);
  }
  return arr.join("\r\n");
};

exports.postPlayer = async (name, telegram_id) => {
  try {
    // do nothing if protection is on
    if (protection) {
      return "Player protection is on. There is nothing to do.";
    }
    displayName = name;
    name = name.toLowerCase();
    const player = new Player({ name, displayName, telegram_id });
    await player.save();
    return `Added ${displayName} successfully!`;
  } catch (err) {
    console.log(err);
    return `Could not add ${displayName}`;
  }
};

exports.deletePlayer = async function (telegram_id) {
  try {
    // do nothing if protection is on
    if (protection) {
      return "Player protection is on. There is nothing to do.";
    }
    const player = await Player.findOneAndDelete({ telegram_id });
    if (!player) {
      const err = new Error("Player not found");
      err.statusCode = 404;
      console.log(err);
      return;
    }
    // await player.remove();
    return `Player ${player.displayName} deleted`;
  } catch (err) {
    console.log(err);
    return;
  }
};

exports.superDeletePlayer = async function (displayName) {
  try {
    // do nothing if protection is on
    if (protection) {
      return "Player protection is on. There is nothing to do.";
    }
    const player = await Player.findOneAndDelete({ displayName });
    if (!player) {
      const err = new Error("Player not found");
      err.statusCode = 404;
      console.log(err);
      return;
    }
    // await player.remove();
    return `Player ${player.displayName} deleted`;
  } catch (err) {
    console.log(err);
    return;
  }
};
