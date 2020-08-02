/**
 * @module Favorite
 * @category Bot Commands
 */

/**
 * Favorite
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 */
module.exports = async(message, mule, user) => {
  let args = message.args();
  if (!args || args.length == 0) {
    let tokens = await mule.sql.query('token', 'favoriteTokens', [user.rows[0]['user_uuid']]);
    if (!tokens || tokens.rowCount < 1) {
      return ['No favorite tokens yet!', false]
    }

    let tokenList = [];
    tokens = tokens.rows;
    for (let i = 0; i < tokens.length; i++) {
      let symbol = tokens[i]['symbol'];
      let network = tokens[i]['network'];
      if (network == 'mainnet') { network = 'ethereum' }
      network = '#' + network.charAt(0).toUpperCase() + network.slice(1);
      json = {}
      json[symbol] = network;
      tokenList.push(json);
    }
    if (tokenList.length == 0) {
      return ['No favorite tokens yet!', false]
    }
    return [tokenList, true];
  }
  if ((args[0] != 'add' &&
      args[0] != 'remove') ||
      !args[1]
    ) {
      return ['Invalid favorite command.', false];
  }

  let network = user.rows[0]['network'];

  if (args[0] == 'add') {
    let token_id;
    let exists = await mule.sql.query('token', 'getTokenId', [String(args[1]), network]);
    if (!exists) {
      if (args[1].length != 42 || args[1].indexOf('0x') != 0) {
        return ['Token not found, try adding it by the contract address!', false]
      }
      let adapter = await mule.web3.ERC20Adapter(network, String(args[1]));
      if (!adapter) {
        return ['Oops, mule ran into a problem!', false];
      }
      let tokenInfo = await adapter.tokenInfo();
      if (!tokenInfo || !tokenInfo.token_name || !tokenInfo.token_symbol) {
        return ['Oops, mule could not find information for this token.', false];
      }
      let addToken = await mule.sql.query('token', 'addToken', [tokenInfo.token_symbol, tokenInfo.token_name, String(args[1]), network]);
      if (!addToken || !addToken.rows[0]['token_id']) {
        return ['Oops, mule ran into a problem!', false];
      }
      token_id = addToken.rows[0]['token_id'];
    } else {
      token_id = exists.rows[0]['token_id'];
    }

    let tokens = await mule.sql.query('token', 'favoriteTokens', [user.rows[0]['user_uuid']]);
    if (tokens.rowCount >= 5 ) {
      return ['Max favorite tokens added.', false];
    }

    let addFavorite = await mule.sql.query('token', 'addFavorite', [user.rows[0]['user_uuid'], token_id]);
    return ['Token added to favorites.', false];
  } else {
    let tokenId = await mule.sql.query('token', 'getTokenId', [String(args[1]), network]);
    if (!tokenId || tokenId.rowCount < 1) {
      return ['Token not found.'. false];
    }
    let delFav = await mule.sql.query('token', 'delFavorite', [user.rows[0]['user_uuid'], tokenId.rows[0]['token_id']]);
    return ['Token removed from favorites.', false];
  }

}
