/**
 * @module /logout
 * @category API
 * @subcategory Client
 */
/**
 * /logout
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  if (!req.session || !req.session.user) {
    return resp(req,res,200,{},{'is_logged_in': false});
  }
  req.session.destroy();
  return resp(req,res,200,{},{'is_logged_in': false});
}
