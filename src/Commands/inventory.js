/**
 * @module Inventory
 * @category Bot Commands
 */

/**
 * Inventory
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 */
module.exports = async(message, mule, user) => {
  let args = message.args();

  let network = args.indexOf('on') >= 0 && args[args.indexOf('on') + 1] ? args[args.indexOf('on') + 1].toLowerCase() : user.rows[0]['network'];

  let address;
  if (!args || args.length == 0) {
    address = (user.rows[0]['is_internal'] ? user.rows[0]['address'] : user.rows[0]['e_address']);
  } else {
    let target = args[0];
    let isMention = await message.getMention();
    targetUser = isMention ? isMention : (target.indexOf('@') > 0 ? target.split('@')[0] : target);

    let platforms = ['mule', 'telegram', 'discord'];
    let platform = platforms.indexOf(target.split('@')[1]) >= 0 ? target.split('@')[1] : mule.client;

    let reqData = {
      'user': targetUser,
      'platform': platform
    }

    let userAddress = await mule.api.request('/address-user', reqData);
    if (!userAddress || userAddress.status !== 200 || !userAddress.data || !userAddress.data.address) {
      return ['User address not found!', false];
    }
    address = userAddress.data.address;
  }

  let Contract = args.indexOf('contract') >= 0 && args[args.indexOf('contract') + 1] ? args[args.indexOf('contract') + 1].toLowerCase() : false
  let Name = args.indexOf('item') >= 0 && args[args.indexOf('item') + 1] ? args[args.indexOf('item') + 1].toLowerCase() : false;

  let os = new mule.os(network);
  let inventory = await os.getInventory(address, Contract, Name);
  if (!inventory) {
    return ['No assets found.', false];
  }
  return [inventory, 200];
}
