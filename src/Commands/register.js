/**
 * @module Register
 * @category Bot Commands
 */

/**
 * Register
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 */
module.exports = async(message, mule) => {
  let user = await mule.sql.query('bot', 'getUser', [message.user_id]);
  if (user && user.rowCount > 0) {
    return [await mule.response('registerExists'), false];
  }

  let link_key =  '';
  try {
    let link_info = {'platform': mule.client, 'id': message.user_id, 'username': message.username};
    link_key = await mule.redis.store(JSON.stringify(link_info));
  } catch(ex) {
    return ["Couldnt generate register link", false];
  }

  let embed = await message.embed(mule.client == 'discord' ? link_key : false, 'register', 'Register', 'Register a new mule from the sanctuary');
  return [{embed}, true];
}
