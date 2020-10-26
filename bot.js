const TelegramBot = require("node-telegram-bot-api");
// prod variables
let token = process.env.TOKEN;
const port = process.env.PORT || 8443;
const host = process.env.HOST;
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
  console.log("port: ", port);
  console.log("host: ", host);
  bot = new TelegramBot(token, { webHook: { port: port, host: host } });
  bot.setWebHook(`${heroku}`);
}

module.exports = bot;
