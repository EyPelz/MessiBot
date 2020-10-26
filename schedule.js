const axios = require("axios");
const schedule = require("node-schedule");
const heroku = process.env.URL;

const pingHeroku = async () => {
  try {
    await axios.get(heroku);
  } catch (error) {
    // console.log(error);
  }
};

if (process.env.mode !== "test") {
  const pinger = schedule.scheduleJob("*/29 * * * *", pingHeroku);
}
