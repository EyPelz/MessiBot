require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const cors = require("cors");
const token = process.env.TOKEN;
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;

// connect to db (mongodb + mongoose)
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

// import routes
const matchRoutes = require("./routes/match.router");
const playerRoutes = require("./routes/player.router");

// middlewares
app.use(cors()); // allow cors origin
app.use(express.json()); // accept json
app.use("/players", playerRoutes);
app.use("/matches", matchRoutes);

// start app
app.listen(EXPRESS_PORT, () =>
  console.log(`Listening on port ${EXPRESS_PORT}!`)
);

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true,
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/scoreboard/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage();
});
