/**
 * @module Address
 * @category Bot Commands
 */

/**
 * Address
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 */
module.exports = async(message, mule, user) => {
  let args = message.args();
  if (!args || args.length == 0) {
    return [(user.rows[0]['is_internal'] ? user.rows[0]['address'] : user.rows[0]['e_address']), true];
  }
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
    return ['No results found!', false];
  }

  let response = ''
  if (userAddress.data.address) {
    response += userAddress.data.address;
  } else {
    response += 'Address: Not found!';
  }

  return [response, true];
}
