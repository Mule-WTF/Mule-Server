const emoji = require('node-emoji');
const emojiList = require('react-emoji-render/data/aliases.js');

/**
 * @class Responder
 * @category Telegram
 */

class Responder {
  /**
   * @param {Object} mule - mule class
   */
  constructor(mule) {
    this.mule     = mule;
    this.maxChars = 2000;
  }

  /**
   * Reply
   * @param {string} cmd - command being used
   * @param {Object} messageHnadler - Message handler class
   * @param {string} res - response message
   * @param {boolean} success - was command successful
   * @param {Object} [user = false] - GetUser db query
   */
  async reply(cmd, messageHandler, res, success, user) {
    let link;

    if (res.embed) {
      res = res.embed;
      link = true;
    }

    if(res.indexOf(':') >= 0 || res.indexOf('!mule') >= 0) {
      res = res.split(' ');
      for (let i = 0; i < res.length; i++) {
        if (res[i].indexOf('!mule') >= 0 ) { res[i] = res[i].replace('!mule', '/mule') }
        let pos1 = res[i].indexOf(":");
        let pos2 = res[i].indexOf(":", pos1 + 1);
        let emojiName = res[i].substring(pos1 + 1, pos2);
        let emojiSymbol = emojiList[emojiName];
        if (!emojiSymbol) { continue }
        res[i] = res[i].replace(':' + emojiName + ':', emojiSymbol);
      }
      res = res.join(' ');
    }

    if (!success) {
      messageHandler.dm(res)
      return;
    }

    if (res.help) {
      messageHandler.send(await this.block(res.help));
      return;
    }

    if (link && cmd == 'profile') {
      messageHandler.send(res);
      return;
    } else if (link) {
      messageHandler.dm(res);
      return;
    }

    let header = '';
    if (user && cmd != 'metaverse' && !link) {
      header = await this.header(user, cmd)
    }

    let msgLen = header.length;

    switch(cmd) {
      case 'balance':
        if (!Array.isArray(JSON.parse(res)['balances'])) { break; }
        res = JSON.parse(res);
        if (res.isUser) {
          header = await this.header(user, cmd, res.network)
        } else {
          header = '';
        }
        res = await this.arrayMsg(res.balances, msgLen);
        break;
      case 'favorite': case 'favourite':
        if (!Array.isArray(res)) { break; }
        res = await this.arrayMsg(res, msgLen);
        break;
      case 'address':
        res = await this.quote(res);
        break;
      case 'commands':
        res = await this.block(res);
        break;
      case 'metaverse':
        if (res.list) {
          res = await this.block("\n" + res.list);
        }
      default:
    }

    messageHandler.send(header + res);
    return;
  }

  /**
  * Create Message Header
  * @param {Object} user - GetUser db query
  * @param {string} cmd - command used
  * @param {string} net - network user is on
  */
  async header(user, cmd, net = false) {
    let name = user.rows[0]['mule_name'];
    let network = await this.mule.metaverse(net ? net : user.rows[0]['network']);
    let icon = cmd != 'stash' && cmd != 'unstash'
        ? user.rows[0]['is_internal']
          ? ""
          : ':lock:'
        : cmd == 'stash'
          ? ':lock:'
          : '';
    let header = icon + "*" + name + "* | `" + network.substring(0, (network.indexOf(':') - 1)) + "`" + network.substring(network.indexOf(':')) + "\n";
      header = header.split(' ');
      for (let i = 0; i < header.length; i++) {
        let pos1 = header[i].indexOf(":");
        let pos2 = header[i].indexOf(":", pos1 + 1);
        let emojiName = header[i].substring(pos1 + 1, pos2);
        let emojiSymbol = emojiList[emojiName];
        header[i] = header[i].replace(':' + emojiName + ':', emojiSymbol);
      }
      header = header.join(' ');
    return header;
  }

  /**
   * Array message to string
   * @param {Object} array - array data for message reply
   * @param {string | Number} - message current length
   */
  async arrayMsg(array, msgLen) {
    let table = "```\n";
    for (let i=0; i < array.length; i++) {
      let newRow = (Object.keys(array[i])[0].length >= 8 ? Object.keys(array[i])[0].substring(0,8) : Object.keys(array[i])[0].padEnd(8)) + ' | ' + (array[i][Object.keys(array[i])[0]].length >= 18 ? array[i][Object.keys(array[i])[0]].substring(0,18) : array[i][Object.keys(array[i])[0]].padEnd(18)) + "\n";
      if ((newRow.length + table.length + 3 + msgLen) >= this.maxChars) { break }
      table += newRow;
    }
    table += "```";
    return table;
  }

  /**
   * Quote the content
   * @param {string} content - reply content
   */
  async quote(content) {
    return "`" + content + "`";
  }

  /**
   * Code block the content
   * @param {string} content - reply content
   */
  async block(content) {
    return "```" + content + "```";
  }

}
module.exports = Responder;
