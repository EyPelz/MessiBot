// init env variables
require("dotenv").config();
// const adminId = process.env.ADMIN_ID;
// init bot
const bot = require("./bot");
// init db
const db = require("./db");
const commands = require("./models/command");
// reference bot functions
const botController = require("./controllers/bot.controller");

bot.onText(/\/player add (.+)/, botController.addPlayer);

bot.onText(/\/addplayer/, botController.addPlayerGreet);

bot.onText(/\/player superAdd (.+) (.+)/, botController.superAddPlayer);

bot.onText(/\/player get/, botController.getPlayers);

bot.onText(/\/player me/, botController.getMyPlayer);

bot.onText(/\/player delete/, botController.deleteMyPlayer);

bot.onText(/\/player superDelete (.+)/, botController.superDeletePlayer);

// bot.onText(/\/match add (.+) (.+) (.+) (.+)/, botController.addMatch);

bot.onText(/\/match get$/, botController.getMatches);

bot.onText(/\/mymatches/, botController.getMyMatches);

bot.onText(/\/scoreboard/, botController.getScoreboard);

bot.onText(/\/addmatch/, botController.postMatchPlayer1);

bot.on("callback_query", async (callbackQuery) => {
  const data = JSON.parse(callbackQuery.data);
  const msg = callbackQuery.message;
  const command = data.command;
  const answer = data.answer;
  const o_id = data.o_id || null;

  if (answer === "Exit") {
    botController.exit(msg, o_id);
    return;
  }

  if (command === commands.postMatchPlayer1) {
    console.log(`Got input from ${command}`);
    botController.postMatchPlayer2(msg, answer, o_id);
  }

  if (command === commands.postMatchPlayer2) {
    console.log(`Got input from ${command}`);
    botController.postMatchGoalsPlayer1(msg, answer, o_id);
  }

  if (command === commands.postMatchGoalsPlayer1) {
    console.log(`Got input from ${command}`);
    botController.postMatchGoalsPlayer2(msg, answer, o_id);
  }
});
