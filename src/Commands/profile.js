/**
 * @module Profile
 * @category Bot Commands
 */

/**
 * Profile
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 */
module.exports = async(message, mule, user) => {
  let args = message.args();
  let targetUser, platform;
  if (!args || args.length == 0) {
    targetUser = user.rows[0]['mule_name']
    platform = 'mule';
  } else {
    let target = args[0];
    let isMention = await message.getMention();
    targetUser = isMention ? isMention : (target.indexOf('@') > 0 ? target.split('@')[0] : target);
    let platforms = ['mule', 'telegram', 'discord'];
    platform = platforms.indexOf(target.split('@')[1]) >= 0 ? target.split('@')[1] : mule.client;
  }

  let reqData = {
    'user': targetUser,
    'platform': platform
  }

  let userName = await mule.api.request('/user', reqData);
  if (!userName || userName.status !== 200 || !userName.data || !userName.data.user) {
    return ['No results found!', false];
  }

  let embed = await message.embed(false, "profile/" + userName.data.user, userName.data.user + ' Profile', 'See profile for ' + userName.data.user  + ' and view their address and linked accounts');
  return [{embed}, true]
}
