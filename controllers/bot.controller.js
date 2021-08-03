const playerController = require("./player.controller");
const matchController = require("./match.controller");
const scoreboardController = require("./scoreboard.controller");
const statisticsController = require("./statistics.controller");
const bot = require("../bot");

exports.addPlayer = async (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];
  const response = await playerController.postPlayer(name, msg.from.id);
  bot.sendMessage(chatId, response);
};

exports.addPlayerGreet = async (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "To add yourself as a player, write the following:\n/player add *your name*\nYou will be added as *your name*"
  );
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
  // // deletes the previous message
  // bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(msg.chat.id, "Who did you play against?", response);
};

exports.postMatchPlayer2 = async (msg, answer, o_id) => {
  const response = await matchController.postMatchPlayer2(msg, answer, o_id);
  if (!response) {
    console.log("response is null", " postmatchplayer2");
    return;
  }
  // deletes the previous message
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(msg.chat.id, "How many goals did you score?", response);
};

exports.postMatchGoalsPlayer1 = async (msg, answer, o_id) => {
  const response = await matchController.postMatchGoalsPlayer1(
    msg,
    answer,
    o_id
  );
  if (!response) return;
  // deletes the previous message
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(
    msg.chat.id,
    `How many goals did ${response.p2name} score?`,
    response.reply_markup
  );
};

exports.postMatchGoalsPlayer2 = async (msg, answer, o_id) => {
  const response = await matchController.postMatchGoalsPlayer2(
    msg,
    answer,
    o_id
  );
  if (!response) return;
  // deletes the previous message
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(msg.chat.id, response);
};

exports.exit = (msg, o_id) => {
  const response = matchController.removeTemp(msg, o_id);
  if (!response) return;
  // deletes the previous message
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(msg.chat.id, "Stopped");
};
// Post match (END) ------------------------------------------------------------

exports.getScoreboard = async (msg) => {
  const response = await scoreboardController.getScoreboard();
  bot.sendMessage(msg.chat.id, response);
};

exports.getTable = async (msg) => {
  const response = await scoreboardController.getTable();
  bot.sendMessage(msg.chat.id, response, { parse_mode: "HTML" });
};

exports.getMyMatches = async (msg) => {
  const response = await matchController.getMyMatches(msg.from.id);
  bot.sendMessage(msg.chat.id, response);
};

exports.getMyGoalStatistics = async (msg) => {
  const response = await statisticsController.getMyGoalStatistics(msg.from.id);
  bot.sendMessage(msg.chat.id, response);
};

// exports.applySeason = async (msg) => {
//   const response = await matchController.applySeasonOnMatches();
//   bot.sendMessage(msg.chat.id, response);
// };
