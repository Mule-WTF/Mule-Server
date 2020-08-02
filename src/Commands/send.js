/**
 * @module Send
 * @category Bot Commands
 */

/**
 * Send
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 */
module.exports = async(message, mule, user) => {
  let txReq = {
    "store": true,
    "from": user.rows[0]['is_internal'] ? user.rows[0]['address'] : user.rows[0]['e_address'],
    "network": user.rows[0]['network']
  }

  let args = message.args();
  if (args.indexOf('on') >= 0 && args[args.indexOf('on') + 1]) {
    txReq["network"] = args[args.indexOf('on') + 1].toLowerCase();
    args.splice(args.indexOf('on'), args.indexOf('on'))
    args.splice(args.indexOf('on') + 1, args.indexOf('on') + 1)
  }

  if (args.length == 2) {
    txReq['token'] = args[1];
  } else if (args.length == 3) {
    txReq['value'] = args[1];
    txReq['token'] = args[2] && args[2].toLowerCase() != 'eth' ? args[2] : false;
  } else {
    return [await mule.response('invalidSend'), false];
  }

  let toUser = args[0];
  let isMention = await message.getMention();
  txReq['to'] = isMention ? isMention : (toUser.indexOf('@') > 0 ? toUser.split('@')[0] : toUser);

  platforms = ['mule', 'telegram', 'discord'];
  txReq['to_platform'] = platforms.indexOf(toUser.split('@')[1]) >= 0 ? toUser.split('@')[1] : mule.client;

  let createTx = await mule.api.request('/create-tx', txReq);
  if (!createTx || createTx.status !== 200 || !createTx.data || !createTx.data.store) {
    return [createTx.response && createTx.response.error ? createTx.response.error : 'Invalid send request.', false];
  }

  let tx_key = createTx.data.key;

  if (createTx.data.approval) {
    let embed = await message.embed(createTx.data.store.key, 'send', 'Enjin Approval', 'Network: ' + await mule.metaverse(txReq['network']) + '\n`You must approve Enjin to spending before you can transfer Enjin items.`\n*This transaction will expire in 15 minutes*');
    return [{embed}, true]
  }
  let embed = await message.embed(createTx.data.store.key, 'send', 'Send Transaction', 'Network: ' + await mule.metaverse(txReq['network']) + '\nValue: `' + (txReq['value'] ? (txReq['value']) + ' ' + (args[2] && args[2].toLowerCase() != 'eth' ? args[2].toUpperCase() : 'ETH') : txReq['token'])+ '`\nTo: `' + (createTx.data.tx_info.toUsername ? createTx.data.tx_info.toUsername : createTx.data.tx_info.to) + '`\n*This transaction will expire in 15 minutes*');
  return [{embed}, true]
}
