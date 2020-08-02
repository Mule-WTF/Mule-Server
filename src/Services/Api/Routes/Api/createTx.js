const txAddress = require('../../Utils/txAddress.js');
const txToken   = require('../../Utils/txToken.js');

/**
 * @module /create-tx
 * @category API
 * @subcategory Public
 */

/**
 * /create-tx
 * @param {string} req.body.to - The person the transaction is to [mule name, address, platform username, ENS]
 * @param {string} req.body.from - The person the transaction is from
 * @param {string} [req.body.network = mainnet] - Network the transaction is on
 * @param {string} [req.body.from_platform = false] - Platform req.body.from is from, unless address or ENS
 * @param {string} [req.body.to_platform = false] - Platform req.body.to is from, unless address or ENS
 * @param {string} [req.body.token = false] - [token_contract, token_contract/token_id, opensea_url]
 * @param {string} [req.body.value = 0] - Value of token or eth
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body ||
    !req.body.to ||
    !req.body.from
    ) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
  }
  let platforms = ['mule', 'discord', 'telegram'];
  let fromPlatform, toPlatform;
  if (req.body.to_platform) {
    toPlatform = platforms.indexOf(req.body.to_platform) < 0 ? 'mule' : req.body.to_platform;
  }
  if (req.body.from_platform) {
    fromPlatform = platforms.indexOf(req.body.from_platform) < 0 ? 'mule' : req.body.from_platform;
  }

  let [fromAddress, fromUsername] = await txAddress(mule, req.body.from, fromPlatform);
  if (!fromAddress) {
    return resp(req,res,400,{'error': 'From address not found.'},{});
  }

  let [toAddress, toUsername] = await txAddress(mule, req.body.to, toPlatform);
  if (!toAddress) {
    return resp(req,res,400,{'error': 'To address not found.'},{});
  }

  let network = 'mainnet';
  if (req.body.network) {
    network = req.body.network.replace('ethereum', 'mainnet');
  }

  let isToken, contract, id, contractData;
  let tokenInfo = {};
  if (req.body.token) {
    isToken = req.body.token;
    [contract, id] = await txToken(mule, isToken, network);
    if (!contract) {
      return resp(req,res,400,{'error': 'Invalid token.'},{});
    }
    if (contract.length != 42 || contract.indexOf('0x') != 0) {
      return resp(req,res,400,{'error': 'Invalid contract.'},{});
    }

    let adapter;
    if (contract.toLowerCase() == '0xfaafdc07907ff5120a76b34b731b278c38d6043c') {
      adapter = await mule.web3.EnjinAdapter();
      let testApprove = await adapter.isApproved(fromAddress);
      if (testApprove && testApprove.data) {
        let web3Adapter = await mule.web3.getAdapter(network);
        if (!web3Adapter) {
          return resp(req,res,500,{'error': 'Invalid network.'},{});
        }
        let rawTx = await web3Adapter.createTx(testApprove.to, fromAddress, '0', testApprove.gas, testApprove.data);
        if (!rawTx || rawTx.error) {
          return resp(req,res,400,{'error': rawTx.error ? rawTx.error : 'Could not create transaction.'},{});
        }
        let txInfo = {
          network: network,
          to: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
          toUsername: 'EnjinCoin',
          from: fromAddress,
          fromUsername: fromUsername,
          value: false,
          token: {'id':'Approval', 'contract_address':'0xfaafdc07907ff5120a76b34b731b278c38d6043c'},
        }
        rawTx['tx_info'] = txInfo;
        rawTx['approval'] = true;

        if (req.body.store) {
          let tx_key, expires;
          try {
            expires = new Date(new Date().valueOf() + ( 15 * 60000)).getTime()
            tx_key = await mule.redis.store(JSON.stringify(rawTx));
          } catch(ex) {
            return resp(req,res,500,{'error': 'Could not store transaction.'},rawTx);
          }
          rawTx['store'] = {'key':tx_key, 'expires': expires}
        }
        return resp(req,res,200,{},rawTx);
      }
    }

    if (!adapter) {
      if (contract && !id) {
        adapter = await mule.web3.ERC20Adapter(network, contract);
      } else {
        adapter = await mule.web3.ERC721Adapter(network, contract);
      }
    }
    if(!adapter) {
      return resp(req,res,500,{'error': 'Invalid contract for this network.'},{});
    }

    contractData = await adapter.transfer(toAddress, id ? id : req.body.value, fromAddress);
    if (!contractData || contractData.error) {
      return resp(req,res,400,{'error': contractData.error ? contractData.error : 'Could not create transaction.'},{});
    }

    if (adapter.tokenInfo) {
      tokenInfo = await adapter.tokenInfo(id ? id : false);
      tokenInfo['contract_address'] = contractData.contract;
    }
  }

  if (!id) {
    if (!req.body.value || req.body.value.length > 18 || !parseFloat(req.body.value) || isNaN(parseFloat(req.body.value)) || parseFloat(req.body.value).toString().length > 16) {
      return resp(req,res,500,{'error': 'Invalid transaction value.'},{});
    }
  }

  let tx = {
    to: isToken ? contractData.contract : toAddress,
    from: fromAddress,
    gas: isToken ? contractData.gas : false,
    value: isToken ? '0' : req.body.value,
    data: isToken ? contractData.data : false
  }

  let web3Adapter = await mule.web3.getAdapter(network);
  if (!web3Adapter) {
    return resp(req,res,500,{'error': 'Invalid network.'},{});
  }
  let rawTx = await web3Adapter.createTx(tx.to, tx.from, tx.value, tx.gas, tx.data);
  if (!rawTx || rawTx.error) {
    return resp(req,res,400,{'error': rawTx.error ? rawTx.error : 'Could not create transaction.'},{});
  }

  let txInfo = {
    network: network,
    to: toAddress,
    toUsername: toUsername,
    from: fromAddress,
    fromUsername: fromUsername,
    value: isToken ? false : req.body.value,
    token: isToken ? tokenInfo : false
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
    rawTx['store'] = {'key':tx_key, 'expires': expires}
  }

  return resp(req,res,200,{},rawTx);
}
