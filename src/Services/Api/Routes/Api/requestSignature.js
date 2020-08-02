/**
 * @module /request-signature !NOT IMPLEMENTED
 * @category API
 * @subcategory Public
 */

/**
 * /request-signature
 * @param {}
 * @param {}
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body ||
      !req.body.message
    ) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

  if (req.body.message.length > 500) {
    return resp(req,res,400,{'error': 'Message must be 500 or less characters.'},{});
  }

  let tx_key, expires;
  try {
    expires = new Date(new Date().valueOf() + ( 15 * 60000)).getTime()
    req_key = await mule.redis.store(req.body.message);
  } catch(ex) {
    return resp(req,res,500,{'error': 'Could not store message.'}, {});
  }
  return resp(req,res,200,{},{'key':req_key, 'expires': expires});

}
