/**
 * @module /token-list/:network
 * @category API
 * @subcategory Public
 */
/**
 * /token-list/:network
 * @param {string} [:network = mainnet] = network to get token list of
 */

module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  let network;
  if (!req.params ||
      !req.params.network
    ) {
        network = 'mainnet';
  }

  network = req.params.network;

  let tokenList = await mule.sql.query('token', 'tokenList', [network]);
  if (!tokenList || tokenList.rowCount < 1) {
    return resp(req,res,500,{'error': 'Could not get token list.'}, {})
  }

  return resp(req,res,200,{},{tokens: tokenList.rows});
}
