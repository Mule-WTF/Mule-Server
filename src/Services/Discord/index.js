/**
 * @module Server
 * @category Discord
 */
/**
 * Server
 */
/* Local */
const MuleController    = require('../../Classes/MuleController/MuleController.js');
const MessageHandler    = require('../../Classes/MessageHandlers/discord.js');
const messageFilter     = require('./Utils/messageFilter.js');
const Responder         = require('./Utils/responder.js');
const cfg               = require('../../Config/muleConfig.js');

/* NPM */
const { Client } = require('discord.js');

/* Classes */
const client = new Client();
const mule   = new MuleController('discord');
const responder = new Responder(mule);

/* Start */
client.on('ready', async () => {
    console.log('Discord Bot Ready!');
});

/* Message Handler */
client.on('message', async (message) => {
  // filter messages for command
  let cmd = await messageFilter(client, message);
  if (!cmd) { return }
  // !mule command
  let messageHandler = new MessageHandler(message, cfg, client);
  let [response, success, user] = await mule.router.command(cmd, messageHandler, mule);
  if (!response) {
    return;
  }
  // format messages to discord
  responder.reply(cmd, messageHandler, response, success, user);
});

function privateMessage(id, msg, channel) {
  if (!channel) {
    try {
      client.fetchUser(id,false).then(user => {
        user.send(msg);
      });
    } catch(ex) {}
    return;
  }
  client.channels.get(id).send(msg);
  return;
}

/* Bot Key */
client.login(cfg.DISCORD_BOT_KEY);

module.exports = {
  privateMessage
}
