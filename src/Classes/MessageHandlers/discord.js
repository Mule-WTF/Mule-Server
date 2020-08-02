/** Class for discord functions */
class DiscordMessageHandler {
  /**
   * Create handler
   * @param {Object} message - Message data from Discord.js
   * @param {Object} cfg - Configuration Settings
   * @param {Object} client - Discord client
   */
  constructor(message, cfg, client) {
    this.cfg        = cfg;
    this.client     = client;
    this.message    = message;
    this.username   = message.author.username + '#' + message.author.discriminator;
    this.user_id    = message.author.id;
    this.channel    = (message.channel.type === 'text') ? message.channel.id : false;
  }

  /**
   * Send message to channel or direct message
   * @param {Object | string} content - Message or embed
   */
  send(content) {
    if (this.message.channel) {
      this.chan(content);
      return;
    }
    this.dm(content);
    return;
  }

  /**
   * Direct message
   * @param {Object | string} content - Message or embed
   */
  dm(content) {
    this.message.author.send(content).catch((ex) => { if (content.length > 0) { this.dmError() } });
  }

  /**
   * Channel reply
   * @param {Object | string} content - Message or embed
   */
  chan(content) {
    this.message.channel.send(content).catch((ex) => {console.log(ex)});
  }

  /**
   * Direct message failure (User has DM disabled)
   */
  dmError() {
    this.message.channel.send("Please enable direct messages for Mule.WTF").catch((ex) => {console.log(ex)});
  }

  /**
   * Get command arguments
   */
  args() {
    let rawArgs = this.message.content.replace( /\s\s+/g, ' ').split(' ');
    if (rawArgs.length > 10) { rawArgs.splice(0,6) }
    let commandArgs = [];
    for (let i = 0; i < rawArgs.length; i++) {
      commandArgs.push(rawArgs[i].toLowerCase());
    }
    if (commandArgs[0] != '!mule' && !commandArgs[0].startsWith('<')) {
      commandArgs.splice(0,1)
    } else {
      commandArgs.splice(0,2)
    }
    return commandArgs;
  }

  /**
   * Get message user mentions
   *
   */
  async getMention() {
    try {
      let discordId = this.message.mentions.users.array()[0].id
      if (discordId == this.client.user.id) {
        discordId = this.message.mentions.users.array()[1].id
      }
      return discordId;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Create embed
   * @param {string} key - UUID for unique link
   * @param {string} route - route for client page
   * @param {string} title - title for the embed
   * @param {string} description - information for the embed
   */

  embed(key, route, title, description) {
    let link = this.cfg.CLIENT_URL + '/' + route + (key ? '/'+ key : '');
    let embed = {
        "title": title,
        "description": description,
        "thumbnail": {
          "url": "https://mule.wtf/mule.png"
        },
        "url": link,
        "color": 2222222,
        "author": {
            "name": "Mule.WTF",
        }
    };
    return embed
  }

  /**
   * Get formatted metaverse string
   * @param {string} network - network name to format
   */
  metaverse(network) {
    if (network == 'mainnet') {
      return "`#Ethereum` :unicorn:"
    } else if (network == 'rinkeby') {
      return "`#Rinkeby` :test_tube::unicorn:"
    } else if (network == 'kovan') {
      return "`#Kovan` :test_tube::unicorn:"
    } else if (network == 'matic') {
      return "#Matic :rocket:"
    } else if (network == 'matic-mumbai') {
      return "#Matic Mumbai :rocket: :test_tube:"
    }
  }

}

module.exports = DiscordMessageHandler;
