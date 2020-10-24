/**
 * @module /set-network
 * @category API
 * @subcategory Client
 */
/**
 * /set-network
 * @param {string} req.body.network - Network to set account to [mainnet, rinkeby, etc..]
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }
  let network = mule.web3.networks;
  if(!req.body || !req.body.network || network.indexOf(req.body.network) < 0) {
    return resp(req,res,400,{'error': 'Invalid network.'},{});
  }

  console.warn("FORCING RINKEBY NETWORK ON DEV")

  let setNetwork = await mule.sql.query('web', 'setNetwork', [req.session.user, "rinkeby"]);
  if (!setNetwork || setNetwork.rowCount < 1) {
    return resp(req,res,400,{'error': 'Could not set network.'},{});
  }

  return resp(req,res,200,{},{});
}
