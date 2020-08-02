const getBalances = require('../../Utils/getBalances.js');
const txToken     = require('../../Utils/txToken.js');
const txAddress   = require('../../Utils/txAddress.js');

/**
 * @module /get-balance
 * @category API
 * @subcategory Public
 */

/**
 * /get-balance
 * @param {string} req.body.target - [mule name, address, platform username, ENS]
 * @param {string} [req.body.target_platform = false] - Platform req.body.target is from, unless target is address or ENS
 * @param {string} [req.body.network = mainnet] - Network to get balance on
 * @param {string} [req.body.as = false] - View balance as another user (see their favorite tokens) [mule name, address, platform username, ENS]
 * @param {string} [req.body.of = false] - View balance of a specific token [contract_address, token_name]
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body || !req.body.target) {
    return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

  let network = req.body.network ? String(req.body.network) : 'mainnet';

  let platforms = ['mule', 'discord', 'telegram'];
  let targetPlatform, asPlatform;
  if (req.body.as_platform) {
    asPlatform = platforms.indexOf(req.body.as_platform) < 0 ? 'mule' : req.body.as_platform;
  }
  if (req.body.target_platform) {
    targetPlatform = platforms.indexOf(req.body.target_platform) < 0 ? 'mule' : req.body.target_platform;
  }

  let user;
  if (req.body.as) {
    [user] = await txAddress(mule, req.body.as, req.body.asPlatform);
  }

  let target;
  [target] = await txAddress(mule, req.body.target, targetPlatform);
  if (!target) {
    return resp(req,res,400,{'error': 'Could not find address.'},{});
  }

  let token;
  if (req.body.of) {
    if (req.body.of.length == 42 && req.body.of.indexOf('0x') == 0) {
      token = req.body.of;
    } else {
      let exists = await mule.sql.query('token', 'findToken', [String(req.body.of), network]);
      if (exists && exists.rowCount > 0) {
        token = exists.rows[0]['address'];
      } else {
        [contractLookup, id] = await txToken(mule, String(req.body.of), network);
        if (contractLookup) {
          token = contractLookup;
        }
      }
    }
    if (!token) {
      return resp(req,res,400,{'error': 'Could not find token.'},{});
    }
  }

  let balances = await getBalances(user, mule, target, network, token);
  if (!balances) {
    return resp(req,res,500,{'error': 'Internal Error.'},{});
  }

  return resp(req,res,200,{},{'balances':balances});
}
