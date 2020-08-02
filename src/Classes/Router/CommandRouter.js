const commands = require('./CommandList.js');

/** Command Router */
class CommandRouter {
  /**
   * Command from user to command function
   * @param {string} cmd - Command
   * @param {Object} message - Message class
   * @param {Object} mule - Mule class
   */
  async command(cmd, message, mule) {
    let res, success;
    if (commands.indexOf(cmd) < 0) {
      return ["I'm sorry Dave, I'm afraid I can't do that", true];
    }

    // Help with specific command
    if (cmd !== 'help' && message.args().indexOf('help') >= 0) {
      [res, success] = await require('../../Commands/commandHelp.js')(cmd);
      return [res, success, false]
    }

    // No user await required;
    switch(cmd) {
      case 'help':
        [res, success] = await require('../../Commands/help.js')(mule);
        break;
      case 'commands':
        [res, success] = await require('../../Commands/commands.js')(message);
        break;
      case 'register':
        [res, success] = await require('../../Commands/register.js')(message, mule);
        break;
    }

    if (res) { return [res, success, false] }

    // User await required;
    let user = await mule.sql.query('bot', 'getUser', [message.user_id]);
    if (!user || user.rowCount < 1) {
      return [await mule.response('senderNoAccount'), false, false];
    }

    switch(cmd) {
      case 'send':
        [res, success] = await require('../../Commands/send.js')(message, mule, user)
        break;
      case 'balance':
        [res, success] = await require('../../Commands/balance.js')(message, mule, user)
        break;
      case 'metaverse':
        [res, success] = await require('../../Commands/metaverse.js')(message, mule, user)
        break;
      case 'stash': case 'unstash':
        [res, success] = await require('../../Commands/stashUnstash.js')(message, mule, user, cmd);
        break;
      case 'favorite': case 'favourite':
        [res, success] = await require('../../Commands/favorite.js')(message, mule, user);
        break;
      case 'profile':
        [res, success] = await require('../../Commands/profile.js')(message, mule, user)
        break;
      case 'address':
        [res, success] = await require('../../Commands/address.js')(message, mule, user)
        break;
      case 'poop':
        [res, success] = [':poop:', 200];
        break;
      case 'inventory':
        [res, success] = await require('../../Commands/inventory.js')(message, mule, user)
        break;
    }
    return [res, success, user];
  }
}

module.exports = CommandRouter;
