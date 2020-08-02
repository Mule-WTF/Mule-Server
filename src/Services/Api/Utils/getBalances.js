/**
 * @module getBalances
 * @category API
 * @subcategory Utils
 */
/**
 * getBalances
 * @param {string} user - [mule name, address, ENS, platform name]
 * @param {Object} mule - mule class
 * @param {string} target - target for query if not user
 * @param {string} altNetwork - different network than users set network
 * @param {string} token - get balance of a token
 */
module.exports = async(user, mule, target = false, altNetwork = false, token = false) => {
  let web3Info, address, network, user_uuid;
  if (user) {
    // check if uuid and run differnet query?
    web3Info = await mule.sql.query('api', 'getWeb3Info', [user]);
    if (!web3Info || web3Info.rowCount < 1) {
      return false;
    }
    try {
      user_uuid = web3Info.rows[0]['user_uuid'];
      address = web3Info.rows[0]['is_internal'] ? web3Info.rows[0]['address'] : web3Info.rows[0]['e_address'];
      network = web3Info.rows[0]['network'];
    } catch(ex) {
      return false;
    }
  }

  if (target) {
    address = target;
  }

  if (!user && !target) {
    return false;
  }

  if (altNetwork) {
    network = altNetwork;
  }

  let balances = [];
  if (token) {
    try {
      let adapter = await mule.web3.ERC20Adapter(network, token);
      if (!adapter) { throw 'Bad adapter'}
      let balance = await adapter.getBalance(address);
      if (!balance) { throw 'Balance not returned' }
      let tokenInfo = await adapter.tokenInfo();
      if (!tokenInfo || !tokenInfo.token_name || !tokenInfo.token_symbol) { throw 'Could not get token symbol' }
      let symbol = tokenInfo.token_symbol;
      let json = {}
      json[symbol] = balance;
      json['contract'] = token;
      balances.push(json);
    } catch(ex) {
      return false;
    }
    return balances;
  }

  try {
    let web3Adapter = await mule.web3.getAdapter(network);
    if (!web3Adapter) { throw 'Bad Adapter' }
    let balance = await web3Adapter.getBalance(address);
    if (!balance && isNaN(parseInt(balance))) { throw 'Balance not returned' }
    balances.push({'ETH':balance});
  } catch(ex) {
    balances.push({'ETH':'error'});
    mule.logger.error(ex);
  }

  if (!user_uuid) {
    return balances;
  }

  let tokens = await mule.sql.query('token', 'favoriteTokens', [user_uuid]);
  tokens = tokens && tokens.rowCount > 0 ? tokens.rows : [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i]['network'] == network) {
      try {
        let adapter = await mule.web3.ERC20Adapter(network, tokens[i]['address']);
        if (!adapter) {
          continue;
        }
        let balance = await adapter.getBalance(address);
        if (!balance) {
          continue;
        }
        symbol = tokens[i]['symbol'];
        let json = {}
        json[symbol] = balance;
        json['contract'] = tokens[i]['address'];
        balances.push(json);
      } catch(ex) {
        continue;
      }
    }
  }

  let factoryContracts = []
  try {
    let factory = await mule.web3.factoryAdapter(network);
    let list_1 = await factory.contractsByCreator(web3Info.rows[0]['address']);
    if (list_1) {
      factoryContracts = factoryContracts.concat(list_1);
    }
    let list_2 = await factory.contractsByCreator(web3Info.rows[0]['e_address']);
    if (list_2) {
      factoryContracts = factoryContracts.concat(list_2);
    }
  } catch(ex) {}
  for (let i = 0; i < factoryContracts.length; i++) {
    try {
      let adapter = await mule.web3.ERC20Adapter(network, factoryContracts[i]);
      if (!adapter) {
        continue;
      }
      let balance = await adapter.getBalance(address);
      if (!balance) {
        continue;
      }
      let tokenInfo = await adapter.tokenInfo();
      if (!tokenInfo || !tokenInfo.token_name || !tokenInfo.token_symbol) {
        continue;
      }
      let sym = tokenInfo.token_symbol;
      let json = {}
      json[sym] = balance;
      json['contract'] = factoryContracts[i];
      balances.push(json);

      let exists = await mule.sql.query('token', 'getTokenId', [factoryContracts[i], network]);
      if (!exists) {
        let addToken = await mule.sql.query('token', 'addToken', [sym, sym, factoryContracts[i], network]);
        if (!addToken || !addToken.rows[0]['token_id']) {
          continue;
        }
      }
    } catch(ex) {
      continue;
    }
  }

  return balances;
}
