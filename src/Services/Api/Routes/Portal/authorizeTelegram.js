const crypto = require('crypto');
const cfg = require('../../../../Config/telegramConfig.js');

/**
 * @module /authorize-telegram
 * @category API
 * @subcategory Client
 */
/**
 * /authorize-telegram
 * @param {Object} req.body.auth - Telegram oAuth information
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body ||
      !req.body.auth ||
      !req.session ||
      !req.session.user
  ) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }

  let auth = req.body.auth;
  if (!auth.auth_date ||
      !auth.first_name ||
      !auth.id ||
      !auth.username ||
      !auth.hash
  ) {
    return resp(req,res,400,{'error':'Invalid authorization'},{});
  }

  let authHash = auth.hash;
  delete auth.hash;

  let authString = [];
  for (let key in auth) {
    authString.push(key + '=' + auth[key]);
  }
  authString = await authString.sort();
  authString = authString.join('\n');

  let tokenHash = await crypto.createHash('sha256').update(cfg.TELEGRAM_BOT_KEY).digest();
  let check = await crypto.createHmac("sha256", tokenHash).update(authString).digest('hex');
  if (check != authHash) {
    return resp(req,res,400,{'error':'Invalid authorization'},{});
  }

  let socialExists = await mule.sql.query('web', 'socialIdExists', [auth.id]);
  if (socialExists) {
    return resp(req,res,400,{'error': 'Telegram user already linked to an account'},{});
  }

  let platformExists = await mule.sql.query('web', 'getAccount', [req.session.user]);
  if (!platformExists || platformExists.rowCount < 1) {
    return resp(req,res,400,{'error': 'No account found.'},{});
  }
  if (platformExists.rows[0]['telegram_id'] != null) {
    return resp(req,res,400,{'error': 'Platform already linked.'},{});
  }

  let updateLink = await mule.sql.query('web', 'updateLink', ['telegram', req.session.user, auth.id, auth.username]);
  return resp(req,res,200,{},{});
}
