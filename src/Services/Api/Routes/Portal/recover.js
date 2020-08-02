const crypto    = require('crypto');
const validator = require('validator');
const bcrypt    = require('bcrypt');

/**
 * @module /recover
 * @category API
 * @subcategory Client
 */
/**
 * /recover
 * @param {string} req.body.keystore - keystore file contents
 * @param {string} req.body.password_hash - password hash
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body || !req.body.keystore || !req.body.password_hash) {
    return resp(req,res,400,{'error': 'Invalid request.'},{});
  }
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  /* Confirm User */
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
    return resp(req,res,400,{'error': 'Could not verify password.'},{});
  }

  /* Confirm keystore */
  try {
    JSON.parse(JSON.stringify(req.body.keystore));
  } catch(ex) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }
  let keystore = JSON.stringify(req.body.keystore);

  try {
    JSON.parse(keystore)
  } catch (ex) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }
  if (JSON.parse(keystore).address.length !== 40 || !validator.isHexadecimal(JSON.parse(keystore).address)) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }
  let address = '0x' + JSON.parse(keystore).address;

  let addressExists = await mule.sql.query('web', 'addressExists', [address]);
  if (addressExists && addressExists.rowCount > 0 && addressExists.rows[0]['user_uuid'] != null) {
    return resp(req,res,400,{'error':'Address already linked to an account.'},{});
  }

  let update = await mule.sql.query('web', 'updateKeystore', [req.session.user, keystore, address]);
  if (!update || update.rowCount < 1) {
    return resp(req,res,500,{'error':'Internal Error.'},{});
  }

  return resp(req,res,200,{}, {});
}
