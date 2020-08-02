/**
 * @module /delete-favorite
 * @category API
 * @subcategory Client
 */
/**
 * /delete-favorite
 * @param {string} req.body.contract - contract address
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  if(!req.body || !req.body.contract || req.body.contract.indexOf('0x') != 0 || req.body.contract.length != 42) {
    return resp(req,res,400,{'error': 'Invalid contract.'},{});
  }

  let account = await mule.sql.query('web', 'getAccount', [req.session.user]);
  if (!account || account.rowCount < 1) {
    return resp(req,res,500,{'error':'Internal error'},{});
  }
  let network = account.rows[0]['network'];

  let tokenId = await mule.sql.query('token', 'getTokenId', [req.body.contract, network]);
  if (!tokenId || tokenId.rowCount < 1) {
    return resp(req,res,400,{'error': 'Could not get token.'},{});
  }

  let delFav = await mule.sql.query('token', 'delFavorite', [req.session.user, tokenId.rows[0]['token_id']]);

  return resp(req,res,200,{},{});
}
