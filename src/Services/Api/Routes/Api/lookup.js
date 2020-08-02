/**
 * @module /address-user
 * @category API
 * @subcategory Public
 */
/**
 * /address-user
 * @param {string} req.body.user - [mule name, address, platform username, ENS]
 * @param {string} req.body.platform - Platform oof user, unless address or ENS
 */

const txAddress = require('../../Utils/txAddress.js');
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body ||
    !req.body.user
    ) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
  }
  let [address, user] = await txAddress(mule, req.body.user, req.body.platform ? req.body.platform : 'mule');
  if (!address) {
    return resp(req,res,400,{'error': 'Address not found.'},{});
  }
  return resp(req,res,200,{},{address: address, user: user});
}
