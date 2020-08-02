const getBalances = require('../../Utils/getBalances.js');

/**
 * @module /get-account-balances
 * @category API
 * @subcategory Client
 */
/**
 * /get-account-balances
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  let balances = await getBalances(req.session.user, mule);
  if (!balances) {
    return resp(req,res,500,{'error': 'Internal Error.'},{});
  }

  return resp(req,res,200,{},{'balances':balances});
}
