const dotenv = require('dotenv');
dotenv.config();

let DISCORD_BOT_KEY   = process.env.DISCORD_BOT_KEY;
let CLIENT_URL        = process.env.CLIENT_URL;
let DEV               = process.env.DEV;
let VERSION           = process.env.VERSION;

/** Mule config*/
module.exports = {
  DISCORD_BOT_KEY,
  CLIENT_URL,
  DEV,
  VERSION
}

