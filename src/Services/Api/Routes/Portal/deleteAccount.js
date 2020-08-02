const validator = require('validator');
const bcrypt    = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * @module /delete-account
 * @category API
 * @subcategory Client
 */
/**
 * /delete-account
 * @param {string} req.body.password_hash - password hash
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }
  if (!req.body || !req.body.password_hash) {
    return resp(req,res,400,{'error': 'Password is required!'},{});
  }
  if (!validator.isHash(req.body.password_hash, 'sha256')) {
    return resp(req,res,400,{'error':'Invalid username/password combination.'},{});
  }
  let password_hash = req.body.password_hash;

  let account = await mule.sql.query('web', 'getAccount', [req.session.user]);
  if (!account || account.rowCount < 1) {
    return resp(req,res,500,{'error':'Internal error'},{});
  }
  let name = account.rows[0]['mule_name'];
  let passHash = await mule.sql.query('web', 'getPasswordHash', [name]);
  if (!passHash || passHash.rowCount < 1 || !passHash.rows[0]['user_uuid'] || !passHash.rows[0]['password_hash']) {
    return resp(req,res,400,{'error':'Invalid username/password combination.'},{});
  }

  let nameHash = await crypto.createHash('sha256').update(String(name)).digest('hex');
  if (!bcrypt.compareSync(nameHash + req.body.password_hash, passHash.rows[0]['password_hash'])) {
    return resp(req,res,400,{'error':'Invalid username/password combination.'},{});
  }
  if (passHash.rows[0]['user_uuid'] != req.session.user) {
    return resp(req,res,400,{'error': 'Could not delete account at this time.'},{});
  }

  let delAccount = await mule.sql.query('web', 'deleteAccount', [req.session.user]);
  if (!delAccount || delAccount.rowCount < 1) {
    return resp(req,res,400,{'error': 'Could not delete account at this time.'},{});
  }

  req.session.destroy();
  return resp(req,res,200,{},{});
}
