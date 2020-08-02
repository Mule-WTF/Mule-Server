/**
 * @module /add-token !NOT IMPLEMENTED
 * @category API
 * @subcategory Public
 */

/**
 * AddToken
 * @param {string} req.body.contract - Contract address for token being added
 * @param {string} [req.body.network = false] - Network the contract is on
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body || !req.body.contract || req.body.contract.length != 42 || req.body.contract.indexOf('0x') != 0) {
    return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

  let network = 'mainnet';
  if (req.body.network) { network = req.body.network }

  let token_id;
  let exists = await mule.sql.query('token', 'getTokenId', [req.body.contract, network]);
  if (!exists) {
    let adapter = await mule.web3.ERC20Adapter(network, req.body.contract);
    if (!adapter) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
    }
    let tokenInfo = await adapter.tokenInfo();
    if (!tokenInfo || !tokenInfo.token_name || !tokenInfo.token_symbol) {
      return resp(req,res,400,{'error': 'Invalid contract.'},{});
    }
    let addToken = await mule.sql.query('token', 'addToken', [tokenInfo.token_symbol, tokenInfo.token_name, req.body.contract, network]);
    if (!addToken || !addToken.rows[0]['token_id']) {
      return resp(req,res,500,{'error': 'Internal error.'},{});
    }
    token_id = addToken.rows[0]['token_id'];
  } else {
    token_id = exists.rows[0]['token_id'];
  }

  return resp(req,res,200,{},{});
}
