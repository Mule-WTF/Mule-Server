const validator = require('validator');

/**
 * @module /get-tx/:key
 * @category API
 * @subcategory Public
 */

/**
 * /get-tx/:key
 * @param {string} :key - UUID of stored transaction
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.params ||
      !req.params.key
    ) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

  if (!validator.isUUID(req.params.key, 4)) {
    return resp(req,res,400,{'error': 'Invalid transaction id.'},{});
  }

  let tx;
  try {
    tx = await mule.redis.get(req.params.key);
    if (!tx) {
      throw 'tx expired'
    }
    tx = JSON.parse(tx);
    mule.redis.del(req.params.key);
  } catch (ex) {
    return resp(req,res,400,{'error': 'Transaction does not exist or expired.'},{});
  }

  return resp(req,res,200,{},tx);
}
