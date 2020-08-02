const dotenv = require('dotenv');
dotenv.config();

let PORT         = process.env.PORT;
let SESSION_SECRET    = process.env.SESSION_SECRET;
let DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
let DISCORD_SECRET = process.env.DISCORD_SECRET;
let PRODUCTION     = process.env.PRODUCTION;

/** API config */
module.exports = {
  PORT,
  SESSION_SECRET,
  DISCORD_CLIENT_ID,
  DISCORD_SECRET,
  PRODUCTION
}

