/** Class for telegram functions */
class TelegramMessageHandler {
  /**
   * Create handler
   * @param {Object} message - Message data from telegram-api
   * @param {Object} cfg - Configuration settings
   * @param {Object} client - Telegram client
   */
  constructor(message, cfg, client) {
    this.cfg        = cfg;
    this.client     = client;
    this.message    = message;
    this.username   = message.from.username;
    this.user_id    = message.from.id;
    this.channel    = (message.chat.type !== 'private') ? message.chat.id : false;
    this.msgOpts    = {parse_mode: 'Markdown'}
  }

  /**
   * Send message to channel or direct message
   * @param {Object | string} content - Message or embed
   */
  send(content) {
    if (this.channel) {
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
    try {
      this.client.sendMessage(this.message.from.id, content, this.msgOpts)
    } catch(ex) {
      this.dmError()
    }
  }
  /**
   * Channel(Group) reply
   * @param {Object | string} content - Message or embed
   */
  chan(content) {
    try {
      this.client.sendMessage(this.message.chat.id, content, this.msgOpts)
    } catch(ex) {
      console.log(ex);
    }
  }
  /**
   * Direct message failed
   */
  dmError() {
    try {
      this.client.sendMessage(this.message.chat.id, 'Please start a private conversation with mule!', this.msgOpts);
    } catch(ex) {
      console.log(ex)
    }
  }

  /**
   * Get command arguments
   */
  args() {
    let rawArgs = this.message.text.replace( /\s\s+/g, ' ').split(' ');
    if (rawArgs.length > 10) { rawArgs.splice(0,6) }
    let commandArgs = [];
    for (let i = 0; i < rawArgs.length; i++) {
      commandArgs.push(rawArgs[i].toLowerCase());
    }
    if (commandArgs[0] != '/mule' && !commandArgs[0].startsWith('<')) {
      commandArgs.splice(0,1)
    } else {
      commandArgs.splice(0,2)
    }
    return commandArgs;
  }

  /**
   * Get user mentions
   */
  async getMention() {
    try {
      if (this.message.text.indexOf('@') > 0) {
        let mention = await this.message.text.split(' ').find(v => v.startsWith('@'));
        return mention.replace('@', '');
      }
      return false;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Create Embed
   * @param {string} key - UUID
   * @param {string} route - Route to client page
   * @param {string} title - Title for embed
   * @param {string} description - Information about embed
   */
  embed(key,route, title, description) {
    let link = this.cfg.CLIENT_URL + '/' + route + (key ? '/'+ key : '');
    return '[' + title + '](' + link + ') \n\n' + description.replace(/_/g, "\\$&");
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
      return "#Matic Mumbai :rocket: :test_tube: :test_tube:"
    }
  }
}

module.exports = TelegramMessageHandler;
