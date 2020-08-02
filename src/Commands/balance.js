/**
 * @module Balance
 * @category Bot Commands
 */

/**
 * Balance
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 */
module.exports = async(message, mule, user) => {
  let apiReq = {
    "of": false,
    "target": false,
    "as": user.rows[0]['is_internal'] ? user.rows[0]['address'] : user.rows[0]['e_address'],
    "network": user.rows[0]['network']
  }
  let args = message.args();
  apiReq["of"] = args.indexOf('of') >= 0 && args[args.indexOf('of') + 1] ? args[args.indexOf('of') + 1] : false;
  apiReq["network"] = args.indexOf('on') >= 0 && args[args.indexOf('on') + 1] ? args[args.indexOf('on') + 1].toLowerCase() : apiReq['network'];
  if (apiReq["network"] == 'ethereum') {
    apiReq["network"] = 'mainnet';
  }

  let isUser = false;
  if (args.indexOf('of') == 0 || args.indexOf('on') == 0) {
    apiReq["target"] = user.rows[0]['is_internal'] ? user.rows[0]['address'] : user.rows[0]['e_address'];
    isUser = true;
  } else {
    let target = args[0];
    if (!target) { isUser = true };
    let isMention = await message.getMention();
    apiReq["target"] = isMention ? isMention : (target && target.indexOf('@') > 0 ? target.split('@')[0] : (target ? target : user.rows[0]['is_internal'] ? user.rows[0]['address'] : user.rows[0]['e_address']));
  }

  let platforms = ['mule', 'telegram', 'discord'];
  let platform = platforms.indexOf(apiReq["target"].split('@')[1]) >= 0 ? apiReq["target"].split('@')[1] : mule.client;
  apiReq['target_platform'] = platform;
  let getBalance = await mule.api.request('/get-balance', apiReq);
  if (!getBalance || getBalance.status !== 200 || !getBalance.data || !getBalance.data.balances) {
    return [getBalance.response && getBalance.response.error ? getBalance.response.error : 'Invalid balance request.', false];
  }

  return [JSON.stringify({isUser: isUser, balances: getBalance.data.balances, network: apiReq['network']}), true];
}
