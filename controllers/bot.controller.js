const playerController = require("./player.controller");
const matchController = require("./match.controller");
const bot = require("../bot");

exports.addPlayer = async (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];
  const response = await playerController.postPlayer(name, msg.from.id);
  bot.sendMessage(chatId, response);
};

exports.superAddPlayer = async (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];
  const id = match[2];
  const response = await playerController.postPlayer(name, id);
  bot.sendMessage(chatId, response);
};

exports.getPlayers = async (msg, match) => {
  console.log("msg: ", msg);
  console.log("match: ", match);
  const chatId = msg.chat.id;
  const response = await playerController.getPlayers();
  bot.sendMessage(chatId, response);
};

exports.getMyPlayer = async (msg, match) => {
  const chatId = msg.chat.id;
  const response = await playerController.getMe(msg.from.id);
  bot.sendMessage(chatId, response);
};

exports.deleteMyPlayer = async (msg, match) => {
  const chatId = msg.chat.id;
  const response = await playerController.deletePlayer(msg.from.id);
  bot.sendMessage(chatId, response);
};

exports.superDeletePlayer = async (msg, match) => {
  // delete by name, for admin only
  const chatId = msg.chat.id;
  const response = await playerController.superDeletePlayer(match[1]);
  bot.sendMessage(chatId, response);
};

exports.addMatch = async (msg, match) => {
  const chatId = msg.chat.id;
  const response = await matchController.postMatch(msg, match);
  bot.sendMessage(chatId, response);
};

exports.getMatches = async (msg, match) => {
  const response = await matchController.getMatches();
  bot.sendMessage(msg.chat.id, response);
};
