/**
 * @module /unlink-stash
 * @category API
 * @subcategory Client
 */
/**
 * /unlink-stash
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  let checkAddr = await mule.sql.query('web', 'checkStash', [req.session.user]);
  if (!checkAddr || checkAddr.rowCount < 1 || checkAddr.rows[0]['e_address'] == null) {
    return resp(req,res,400,{'error':'User does not have stash wallet'},{});
  }

  let delStash = await mule.sql.query('web', 'delStash', [req.session.user]);
  if (!delStash || delStash.rowCount < 1 || delStash.rows[0]['e_address'] != null) {
    return resp(req,res,500,{'error':'Internal Error.'},{});
  }

  return resp(req,res,200,{}, {});
}
