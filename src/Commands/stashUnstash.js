/**
 * @module Stash / Unstash
 * @category Bot Commands
 */

/**
 * Stash / Unstash
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 * @param {string} cmd - Command being used. stash / unstash
 */
module.exports = async(message, mule, user, cmd) => {
  if(!user.rows[0]['address'] || user.rows[0]['address'] == null ||
     !user.rows[0]['e_address'] || user.rows[0]['e_address'] == null
  ) {
    return ['Linked wallet required for stash / unstash commands.', false];
  }

  let txReq = {
    "store": true,
    "to":   cmd == 'stash' ? user.rows[0]['e_address'] : user.rows[0]['address'],
    "from": cmd == 'stash' ? user.rows[0]['address'] : user.rows[0]['e_address'],
    "network": user.rows[0]['network']
  }

  let args = message.args();
  if (!args || args.length == 0) {
    let isMule = user.rows[0]['is_internal'];
    if ( (isMule && cmd == 'unstash') || (!isMule && cmd == 'stash') ) {
      return ['Already using '+ (cmd == 'stash' ? 'Stash' : 'Mule') + ' Wallet', false];
    }
    let setWallet = await mule.sql.query('web', 'setWallet', [user.rows[0]['user_uuid'], (cmd == 'stash' ? 'f' : 't')]);
    if (!setWallet || setWallet.rowCount < 1) {
      return ['Oops, mule had a problem setting your wallet to ' + cmd == 'stash' ? 'stash.' : 'mule.', false];
    }
    return ['Mule is now using ' + (cmd == 'stash' ? 'Stash' : 'Mule') + ' wallet.', true];
  }

  if (args.indexOf('on') >= 0 && args[args.indexOf('on') + 1]) {
    txReq["network"] = args[args.indexOf('on') + 1].toLowerCase();
    args.splice(args.indexOf('on'), args.indexOf('on'))
    args.splice(args.indexOf('on') + 1, args.indexOf('on') + 1)
  }

  if (args.length == 1) {
    txReq['token'] = args[0];
  } else if (args.length == 2) {
    txReq['value'] = args[0];
    txReq['token'] = args[1] && args[1].toLowerCase() != 'eth' ? args[1] : false;
  } else {
    return [await mule.response('invalidSend'), false];
  }

  let createTx = await mule.api.request('/create-tx', txReq);
  if (!createTx || createTx.status !== 200 || !createTx.data || !createTx.data.store) {
    return [createTx.response && createTx.response.error ? createTx.response.error : 'Invalid ' + cmd + ' request.', false];
  }

  let tx_key = createTx.data.store.key;
  let embed = await message.embed(tx_key, cmd, cmd == 'stash' ? 'Stash' : 'Unstash', '*This transaction will expire in 15 minutes*');
  return [{embed}, true]
}
