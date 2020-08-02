const des = require('../Config/networkDescriptions.js');
/**
 * @module Metaverse
 * @category Bot Commands
 */

/**
 * Metaverse
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 */
module.exports = async(message, mule, user) => {
  let args = message.args();
  if (args.length == 0) {
    return [await mule.metaverse(user.rows[0]['network']), true];
  }

  if (args.indexOf('ethereum') >= 0) {
    args[args.indexOf('ethereum')] = 'mainnet';
  }

  if (args.length == 1) {
    if (args[0] == 'info') {
      return [des[user.rows[0]['network']], true];
    } else if (args[0] == 'list') {
      return [{list: await mule.web3.networks.join('\n').replace('mainnet', 'ethereum')}, true];
    }

    if(mule.web3.networks.indexOf(args[0].toLowerCase()) < 0) {
      return ['Invalid metaverse', false];
    }
    if (user.rows[0]['network'] == args[0].toLowerCase()) {
      return ['Your mule is already in this metaverse!', false]
    }
    let setNet = await mule.sql.query('bot', 'setNetwork', [user.rows[0]['user_uuid'], args[0].toLowerCase()]);
    if (!setNet || setNet.rowCount < 1) {
      return ['Oops, there was an error setting the default metaverse', false];
    }
    let newMeta = await mule.metaverse(args[0]);
    return ['Default network set to ' + newMeta, true];
  }

  if (args.length == 2) {
    if (args.indexOf('info') < 0) {
      return ['Invalid metaverse command', false];
    }
    args.splice(args.indexOf('info'), args.indexOf('info') + 1);
    if(mule.web3.networks.indexOf(args[0].toLowerCase()) < 0) {
      return ['Invalid metaverse.', false];
    }
    return [des[args[0]], true];
  }

  return ['Metaverse not found', false];
}
