/**
 * @module txToken
 * @category API
 * @subcategory Utils
 */
/**
 * txToken
 * @param {Object} mule - mule class
 * @param {string} token - token /contract/?token_id
 * @param {string} network - network to query on
 */
module.exports = async(mule, token, network = false) => {
  if (!network) {
    network = 'mainnet';
  }

  if (token.length == 42 && token.indexOf('0x') == 0) {
    return [token, false];
  }

  if (token.split('/').length == 2) {
    let contract = token.split('/')[0];
    let id = token.split('/')[1];
    return [contract, id];
  }

  if(token.indexOf('https://opensea.io/assets/') == 0 || token.indexOf('https://rinkeby.opensea.io/assets/') == 0) {
    let splitUrl = token.split('/');
    if (splitUrl.length != 6) {
      return [false, false];
    }
    let contract = splitUrl[4];
    let id = splitUrl[5];
    return [contract, id];
  }

  let findToken = await mule.sql.query('token', 'findToken', [token, network]);
  if (findToken && findToken.rowCount > 0) {
    return [findToken.rows[0]['address'], false];
  }

  let tokens = [];
  let factoryContracts = [];
  try {
    let factory = await mule.web3.factoryAdapter(network);
    let tokenContract = await factory.contractByName(token);
    if (tokenContract) {
      let adapter = await mule.web3.ERC20Adapter(network, tokenContract);
      if (!adapter) {
        throw 'bad adapter';
      }
      let tokenInfo = await adapter.tokenInfo();
      if (!tokenInfo || !tokenInfo.token_name || !tokenInfo.token_symbol) {
        throw 'No token info';
      }
      let sym = tokenInfo.token_symbol;
      let exists = await mule.sql.query('token', 'getTokenId', [tokenContract, network]);
      if (!exists) {
        let addToken = await mule.sql.query('token', 'addToken', [tokenInfo.token_name, tokenInfo.token_name, tokenContract, network]);
        if (!addToken || !addToken.rows[0]['token_id']) {
          throw 'Token not added';
        }
      }
      return [tokenContract, false]
    }
  } catch(ex) {}

  return [false, false];
}
