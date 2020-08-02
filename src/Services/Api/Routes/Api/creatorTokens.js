const txAddress = require('../../Utils/txAddress.js');

/**
 * @module /get-creator-tokens
 * @category API
 * @subcategory Public
 */

/**
 * /get-creator-tokens
 * @param {string} req.body.creator - [mule name, address, platform username, ENS]
 * @param {string} [req.body.network = mainnet] - Network to get creator tokens on
 * @param {string} [req.body.creator_platform = false] - Platform req.body.creator is from, unless creator is address or ENS
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body ||
      !req.body.creator
    ) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

  let network = 'mainnet';
  if (req.body.network) {
    network = req.body.network;
  }

  let platforms = ['mule', 'discord', 'telegram'];
  let platform = platforms.indexOf(req.body.creator_platform) < 0 ? 'mule' : req.body.creator_platform;

  let [creatorAddress] = await txAddress(mule, req.body.creator, platform);
  if (!creatorAddress) {
    return resp(req,res,400,{'error': 'Creator address not found.'},{});
  }

  let tokens = [];
  let factoryContracts = [];
  try {
    let factory = await mule.web3.factoryAdapter(network);
    let list = await factory.contractsByCreator(creatorAddress);
    if (list) {
      factoryContracts = list;
    }
  } catch(ex) {}
  for (let i = 0; i < factoryContracts.length; i++) {
    try {
      let adapter = await mule.web3.ERC20Adapter(network, factoryContracts[i]);
      if (!adapter) {
        continue;
      }
      let balance = await adapter.getBalance(creatorAddress);
      if (!balance) {
        continue;
      }
      let tokenInfo = await adapter.tokenInfo();
      if (!tokenInfo || !tokenInfo.token_name || !tokenInfo.token_symbol) {
        continue;
      }
      tokens.push({'name': tokenInfo.token_symbol, 'balance': balance})
    } catch(ex) {
      continue;
    }
  }
  return resp(req,res,200,{},{'tokens':tokens});
}
