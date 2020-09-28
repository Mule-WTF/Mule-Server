/**
 * @module /unlink-platform
 * @category API
 * @subcategory Client
 */
/**
 * /unlink-platform
 * @param {string} req.body.platform - platform to unlink
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  let platforms = ['discord', 'telegram'];

  if (!req.body || !req.body.platform || platforms.indexOf(req.body.platform) < 0) {
    return resp(req,res,401,{'error': 'Invalid request.'},{});
  }

  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  let socialExists = await mule.sql.query('web', 'getAccount', [req.session.user]);
  if (!socialExists || socialExists.rowCount < 1) {
    return resp(req,res,400,{'error': 'No account found.'},{});
  }
  if (socialExists.rows[0][req.body.platform + '_id'] == null) {
    return resp(req,res,400,{'error': 'Platform not linked.'},{});
  }

  let delLink = await mule.sql.query('web', 'delLink', [req.body.platform, req.session.user]);
  if (!delLink) {
    return resp(req,res,500,{'error':'Internal Error.'},{});
  }

  return resp(req,res,200,{}, {});
}
