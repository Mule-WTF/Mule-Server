/**
 * @module /user
 * @category API
 * @subcategory Public
 */
/**
 * /user
 * @param {string} req.body.user - User [mule name, platform username]
 * @param {string} [req.body.platform = false] - Platform the user is from, unless address or ENS
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
  if (!user || user.indexOf('.eth') >= 0|| (user.length == 42 && user.indexOf('0x') == 0)) {
    return resp(req,res,404,{'error': 'Profile not found!'},{});
  }
  return resp(req,res,200,{},{user: user});
}
