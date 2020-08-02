/**
 * @module /renew-link
 * @category API
 * @subcategory Client
 */
/**
 * /renew-link
 * @param {string} req.body.key - key for account autolink
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  if (!req.body || !req.body.key) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }

  let newLink;
  if (req.body.link_key && validator.isUUID(req.body.link_key, 4)) {
    let link_key = req.body.key;
    try {
      let link_info = await mule.redis.get(link_key);
      link_info = JSON.parse(link_info)
      if (!link_info || !link_info.platform || !link_info.id || !link_info.username) {
        return resp(req,res,400,{'error': 'Invalid link key'},{});
      }
      let socialExists = await mule.sql.query('web', 'socialIdExists', [link_info.id]);
      if (socialExists) {
        return resp(req,res,400,{'error': link_info.platform + ' account is already linked to another mule'},{});
      }
      mule.redis.keystore.del(link_key)
      newLink = await mule.redis.store(JSON.stringify(link_info));
    } catch (ex) {
      return resp(req,res,400,{'error': 'Invalid link key.'},{});
    }
  }

  return resp(req,res,200,{},{'link_key': newLink});

}
