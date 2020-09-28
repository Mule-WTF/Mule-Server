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
module.exports = async (user, mule, target = false, altNetwork = false, token = false) => {
  let web3Info, address, network, user_uuid, mule_address, stash_address = false;
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
      // Only populate stash if not internal
      mule_address = !!web3Info.rows[0]['address'] ? web3Info.rows[0]['address'] : false;
      stash_address = !!web3Info.rows[0]['e_address'] ? web3Info.rows[0]['e_address'] : false;
    } catch (ex) {
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

  // Populate Mule && Stash Balances
  let mule_balances = [];
  let stash_balances = [];

  // Place mule_balances in [0] and stash_balances in [1]
  let balances = [mule_balances, stash_balances];

  // Only loop twice
  for (let cid = 0; cid < 2; cid++) {

    // Skip 'stash' balances if not available
    // When this happens the 'mule_balance' represents the requested balance
    if (cid === 1 && !stash_address) {
      continue
    }

    // Use standard procedure unless overwritten below
    let loopAddress = address;

    // If address === stash address, use mule_address first, then stash_address second
    // But only if mule_address is available, eg not for external user queries
    if (address === stash_address && mule_address) {
      loopAddress = cid === 0 ? mule_address : stash_address;
    }

    if (token) {
      // console.log("TOKEN", token)
      try {
        let adapter = await mule.web3.ERC20Adapter(network, token);
        if (!adapter) { throw 'Bad adapter' }
        let balance = await adapter.getBalance(loopAddress);
        if (!balance) { throw 'Balance not returned' }
        let tokenInfo = await adapter.tokenInfo();
        if (!tokenInfo || !tokenInfo.token_name || !tokenInfo.token_symbol) { throw 'Could not get token symbol' }
        let symbol = tokenInfo.token_symbol;
        let json = {}
        json[symbol] = balance;
        json['contract'] = token;
        balances[cid].push(json);
      } catch (ex) {
        return false;
      }
    }

    try {
      let web3Adapter = await mule.web3.getAdapter(network);
      if (!web3Adapter) { throw 'Bad Adapter' }
      let balance = await web3Adapter.getBalance(loopAddress);
      if (!balance && isNaN(parseInt(balance))) { throw 'Balance not returned' }
      // console.log(cid, "ETHBAL", balance)
      balances[cid].push({ 'ETH': balance });
    } catch (ex) {
      balances[cid].push({ 'ETH': 'error' });
      mule.logger.error(ex);
    }

    if (!!user_uuid) {
      let tokens = await mule.sql.query('token', 'favoriteTokens', [user_uuid]);
      tokens = tokens && tokens.rowCount > 0 ? tokens.rows : [];
      // console.log(cid, "favtokens", tokens)
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i]['network'] == network) {
          try {
            let adapter = await mule.web3.ERC20Adapter(network, tokens[i]['address']);
            if (!adapter) {
              continue;
            }
            let balance = await adapter.getBalance(loopAddress);
            if (!balance) {
              continue;
            }
            symbol = tokens[i]['symbol'];
            let json = {}
            json[symbol] = balance;
            json['contract'] = tokens[i]['address'];
            balances[cid].push(json);
          } catch (ex) {
            continue;
          }
        }
      }
    }

    let factoryContracts = []
    try {
      // Get the token counts for tokens made with both the mule and stash address
      let factory = await mule.web3.factoryAdapter(network);
      let list_1 = await factory.contractsByCreator(web3Info.rows[0]['address']);
      if (list_1) {
        factoryContracts = factoryContracts.concat(list_1);
      }
      let list_2 = await factory.contractsByCreator(web3Info.rows[0]['e_address']);
      if (list_2) {
        factoryContracts = factoryContracts.concat(list_2);
      }
      // console.log(cid, "FACTORY_CONTRACTS", factoryContracts)
    } catch (ex) { }
    for (let i = 0; i < factoryContracts.length; i++) {
      try {
        let adapter = await mule.web3.ERC20Adapter(network, factoryContracts[i]);
        if (!adapter) {
          continue;
        }
        let balance = await adapter.getBalance(loopAddress);
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
        balances[cid].push(json);

        let exists = await mule.sql.query('token', 'getTokenId', [factoryContracts[i], network]);
        if (!exists) {
          let addToken = await mule.sql.query('token', 'addToken', [sym, sym, factoryContracts[i], network]);
          if (!addToken || !addToken.rows[0]['token_id']) {
            continue;
          }
        }
      } catch (ex) {
        continue;
      }
    }

  }

  // Format return
  let balanceToReturn;
  // If both balances available ( User is authed )
  if (mule_balances.length !== 0 && stash_balances.length !== 0) {
    balanceToReturn = {
      "mule": balances[0],
      "stash": balances[1],
    }
  } else {
    // Even though this represents the 'mule_balance' in the balance array
    // This datapoint will be the default requested data
    balanceToReturn = balances[0];
  }

  return balanceToReturn;
}