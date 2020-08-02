const getBalances = require('../../Utils/getBalances.js');

/**
 * @module /get-favorite-tokens
 * @category API
 * @subcategory Client
 */
/**
 * /get-favorite-tokens
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  let tokens = await mule.sql.query('token', 'favoriteTokens', [req.session.user]);
  if (!tokens || tokens.rowCount < 1) {
    return resp(req,res,200,{},{'tokens':[]});
  }

  let tokenList = [];
  tokens = tokens.rows;
  for (let i = 0; i < tokens.length; i++) {
    let name = tokens[i]['name'];
    let symbol = tokens[i]['symbol'];
    let network = tokens[i]['network'];
    let address = tokens[i]['address'];
    if (network == 'mainnet') { network == 'ethereum' }
    tokenList.push({'name': name, 'symbol': symbol, 'network': network, 'address': address});
  }

  return resp(req,res,200,{},{'tokens': tokenList});
}
