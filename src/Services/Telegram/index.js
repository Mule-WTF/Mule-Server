/* ??? */
process.env.NTBA_FIX_319 = 1;

/**
 * @module Server 
 * @category Telegram
 */
/* Local */
const MuleController    = require('../../Classes/MuleController/MuleController.js');
const MessageHandler    = require('../../Classes/MessageHandlers/telegram.js');
const messageFilter     = require('./Utils/messageFilter.js');
const Responder         = require('./Utils/responder.js');
const cfg               = require('../../Config/telegramConfig.js');

/* NPM */
const telegram = require('node-telegram-bot-api');

/* Classes */
const client = new telegram(cfg.TELEGRAM_BOT_KEY, {polling: true});
const mule   = new MuleController('telegram');
const responder = new Responder(mule);

client.on("polling_error", function(err) { mule.logger.error(err) });

client.onText(/\/mule/, async function(message) {

  let cmd = await messageFilter(client, message);
  if (!cmd) { return }
  let messageHandler = new MessageHandler(message, cfg, client);
  let [response, success, user] = await mule.router.command(cmd, messageHandler, mule);
  if (!response) {
    return;
  }
  responder.reply(cmd, messageHandler, response, success, user);
});

console.log('Telegram Bot Ready!');
