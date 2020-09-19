const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true,
});

module.exports = bot;
