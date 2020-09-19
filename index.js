// init env variables
require("dotenv").config();
// const adminId = process.env.ADMIN_ID;
// init bot
const bot = require("./bot");
// init db
const db = require("./db");
// reference bot functions
const botController = require("./controllers/bot.controller");

bot.onText(/\/player add (.+)/, botController.addPlayer);

bot.onText(/\/player superAdd (.+) (.+)/, botController.superAddPlayer);

bot.onText(/\/player get/, botController.getPlayers);

bot.onText(/\/player me/, botController.getMyPlayer);

bot.onText(/\/player delete/, botController.deleteMyPlayer);

bot.onText(/\/player superDelete (.+)/, botController.superDeletePlayer);

bot.onText(/\/match add (.+) (.+) (.+) (.+)/, botController.addMatch);

bot.onText(/\/match get/, botController.getMatches);
