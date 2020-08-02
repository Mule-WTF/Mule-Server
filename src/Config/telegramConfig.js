const dotenv = require('dotenv');
dotenv.config();

let TELEGRAM_BOT_KEY  = process.env.TELEGRAM_BOT_KEY;
let CLIENT_URL        = process.env.CLIENT_URL;
let DEV               = process.env.DEV;
let VERSION           = process.env.VERSION;

/** Telegram config */
module.exports = {
  TELEGRAM_BOT_KEY,
  CLIENT_URL,
  DEV,
  VERSION
}

