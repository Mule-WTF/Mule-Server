const validator = require('validator');

/**
 * @module /get-signature-request/:key !NOT IMPLEMENTED
 * @category API
 * @subcategory Public
 */

/**
 * /get-signature-request/:key
 * @param {}
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
    return resp(req,res,400,{'error': 'Invalid key.'},{});
  }

  let msg;
  try {
    msg = await mule.redis.get(req.params.key);
    if (!msg) {
      throw 'request expired'
    }
    mule.redis.del(req.params.key);
  } catch (ex) {
    return resp(req,res,400,{'error': 'Message request does not exist or expired.'},{});
  }

  return resp(req,res,200,{},{'message': msg});
}
