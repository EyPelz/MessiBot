const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
if (process.env.MODE === "test") token = process.env.TOKEN_TEST;

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true,
});

module.exports = bot;
