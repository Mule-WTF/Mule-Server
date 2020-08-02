/**
 * @module /is-logged-in
 * @category API
 * @subcategory Client
 */
/**
 * /is-logged-in
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  if (!req.session || !req.session.user) {
    return resp(req,res,200,{},{'is_logged_in': false});
  }
  return resp(req,res,200,{},{'is_logged_in': true});
}
