const validator = require('validator');
const txAddress = require('../../Utils/txAddress.js');
const txToken   = require('../../Utils/txToken.js');

/**
 * @module /create-token
 * @category API
 * @subcategory Public
 */

/**
 * /create-token
 * @param {string} req.body.name - Name of the token
 * @param {string|Number} req.body.supply - Total supply of the token
 * @param {string} [req.body.network = mainnet] - Network to deploy token on
 * @param {string} req.body.from - User or address creating the token
 * @param {string} [req.body.from_platform = false] - Platform req.body.from is from, unless from is address or ENS
 * @param {string} [req.body.store = false] - Store tx and return UUID to fetch tx by
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body ||
    !req.body.name ||
    !req.body.supply ||
    !validator.isNumeric(String(req.body.supply), {no_symbols: true}) ||
    !req.body.from
    ) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

// DEV
if (req.body.network == 'mainnet' || req.body.network == 'ethereum') {
  return resp(req,res,400,{'error': 'TESTNET Only!'},{});
}

  if (req.body.supply > 1000000000) {
    return resp(req,res,400,{'error': 'Supply must be less than or equal to 1000000000'},{});
  }
  if (req.body.supply < 1) {
    return resp(req,res,400,{'error': 'Supply must be greater than 1!'},{});
  }
  let regexp = /^[a-zA-Z0-9\$\?\!]+$/;
  if (!regexp.test(req.body.name)) {
    return resp(req,res,400,{'error': 'Name must only contain a-z, A-Z, 0-9, $, ?, !'},{});
  }

  let network = 'mainnet';
  if (req.body.network) {
    network = req.body.network;
  }

  let platforms = ['mule', 'discord', 'telegram'];
  let platform = platforms.indexOf(req.body.from_platform) < 0 ? 'mule' : req.body.from_platform;

  let [fromAddress, fromUsername] = await txAddress(mule, req.body.from, platform);
  if (!fromAddress) {
    return resp(req,res,400,{'error': 'From address not found.'},{});
  }

  let adapter = await mule.web3.factoryAdapter(network);
  if (!adapter) {
    return resp(req,res,500,{'error': 'No adapter for this network.'},{});
  }
  let contractList = await adapter.contractsByCreator(fromAddress);
  if (contractList.length >= 5) {
    return resp(req,res,400,{'error': 'Address already has 5 tokens.'},{});
  }
  let contractData = await adapter.createToken(req.body.name, req.body.supply, req.body.from);
  if (!contractData || contractData.error) {
      return resp(req,res,400,{'error': contractData.error ? contractData.error : 'Could not create transaction.'},{});
  }

  let tx = {
    to: contractData.contract,
    from: fromAddress,
    gas: contractData.gas ? contractData.gas : false,
    value: '0',
    data: contractData.data ? contractData.data : false
  }

  let web3Adapter = await mule.web3.getAdapter(network);
  if (!web3Adapter) {
    return resp(req,res,500,{'error': 'Internal error.'},{});
  }
  let rawTx = await web3Adapter.createTx(tx.to, tx.from, tx.value, tx.gas, tx.data);
  if (!rawTx || rawTx.error) {
    return resp(req,res,400,{'error': rawTx.error ? rawTx.error : 'Could not create transaction.'},{});
  }

  let txInfo = {
    network: network,
    to: 'Mule Factory',
    from: fromAddress,
    fromUsername: fromUsername,
    name: req.body.name,
    supply: req.body.supply,
  }

  rawTx['tx_info'] = txInfo;

  if (req.body.store) {
    let tx_key, expires;
    try {
      expires = new Date(new Date().valueOf() + ( 15 * 60000)).getTime()
      tx_key = await mule.redis.store(JSON.stringify(rawTx));
    } catch(ex) {
      return resp(req,res,500,{'error': 'Could not store transaction.'},rawTx);
    }
    return resp(req,res,200,{},{'key':tx_key, 'expires': expires});
  }

  return resp(req,res,200,{},rawTx);
}
