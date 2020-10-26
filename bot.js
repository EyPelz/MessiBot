const TelegramBot = require("node-telegram-bot-api");
// prod variables
let token = process.env.TOKEN;
const heroku = process.env.URL;
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
  bot = new TelegramBot(token);
  bot.setWebHook(`${heroku}`);
}

module.exports = bot;
