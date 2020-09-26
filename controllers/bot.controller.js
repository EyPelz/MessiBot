const playerController = require("./player.controller");
const matchController = require("./match.controller");
const scoreboardController = require("./scoreboard.controller");
const commands = require("../models/command");
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
  // console.log("msg: ", msg);
  // console.log("match: ", match);
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

// Post match (START) ------------------------------------------------------------
exports.postMatchPlayer1 = async (msg) => {
  const response = await matchController.postMatchPlayer1(msg);
  // console.log("chatid: ", msg.chat.id);
  bot.sendMessage(msg.chat.id, "Who did you play against?", response);
};

exports.postMatchPlayer2 = async (msg, answer, o_id) => {
  const response = await matchController.postMatchPlayer2(answer, o_id);
  bot.sendMessage(msg.chat.id, "How many goals did you score?", response);
};

exports.postMatchGoalsPlayer1 = async (msg, answer, o_id) => {
  const response = await matchController.postMatchGoalsPlayer1(answer, o_id);
  bot.sendMessage(
    msg.chat.id,
    `How many goals did ${response.p2name} score?`,
    response.reply_markup
  );
};

exports.postMatchGoalsPlayer2 = async (msg, answer, o_id) => {
  const response = await matchController.postMatchGoalsPlayer2(answer, o_id);
  bot.sendMessage(msg.chat.id, response);
};
// Post match (END) ------------------------------------------------------------

exports.getScoreboard = async (msg) => {
  const response = await scoreboardController.getScoreboard();
  bot.sendMessage(msg.chat.id, response);
};
