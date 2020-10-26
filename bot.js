const TelegramBot = require("node-telegram-bot-api");
// prod variables
let token = process.env.TOKEN;
const port = process.env.PORT || 8443;
const host = process.env.HOST;
let bot;

// test variables
if (process.env.MODE === "test") {
  token = process.env.TOKEN_TEST;
  // create test instance
  bot = new TelegramBot(token, {
    polling: true,
  });
} else {
  // create prod instance
  bot = new TelegramBot(token, { webHook: { port: port, host: host } });
}

module.exports = bot;
