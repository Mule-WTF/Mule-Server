/**
 * @module /add-favorite
 * @category API
 * @subcategory Client
 */
/**
 * /add-favorite
 * @param {string} req.body.contract - Contract Address
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  if (!req.body || !req.body.contract || req.body.contract.length != 42 || req.body.contract.indexOf('0x') != 0) {
    return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

  let account = await mule.sql.query('web', 'getAccount', [req.session.user]);
  if (!account || account.rowCount < 1) {
    return resp(req,res,500,{'error':'Internal error'},{});
  }
  let network = account.rows[0]['network'];

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


  let tokens = await mule.sql.query('token', 'favoriteTokens', [req.session.user]);
  if (tokens.rowCount >= 5 ) {
    return resp(req,res,400,{'error': 'Max favorite tokens added.'},{});
  }

  let addFavorite = await mule.sql.query('token', 'addFavorite', [req.session.user, token_id]);
  return resp(req,res,200,{},{});
}
