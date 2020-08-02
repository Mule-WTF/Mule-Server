const validator = require('validator');
const bcrypt    = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * @module /login
 * @category API
 * @subcategory Client
 */
/**
 * /login
 * @param {string} req.body.name - mule name
 * @param {string} req.body.password_hash - hash of password
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  if (!req.body ||
      !req.body.name ||
      !req.body.password_hash
  ) {
    return resp(req,res,400,{'error':'Incomplete Login.'},{});
  }

  if (!validator.isHash(req.body.password_hash, 'sha256')) {
    return resp(req,res,400,{'error':'Invalid username/password combination.'},{});
  }
  let password_hash = req.body.password_hash;

  let validChars = /^[0-9a-zA-Z_-]+$/;
  if (!validChars.test(req.body.name) || req.body.name.length > 16 || req.body.name.length < 5) {
    return resp(req,res,400,{'error':'Invalid username/password combination.'},{});
  }
  let name = req.body.name;
  let mule = res.locals.mule;

  let passHash = await mule.sql.query('web', 'getPasswordHash', [name]);
  if (!passHash || passHash.rowCount < 1 || !passHash.rows[0]['user_uuid'] || !passHash.rows[0]['password_hash']) {
    return resp(req,res,400,{'error':'Invalid username/password combination.'},{});
  }

  let nameHash = await crypto.createHash('sha256').update(String(name)).digest('hex');
  if (!bcrypt.compareSync(nameHash + req.body.password_hash, passHash.rows[0]['password_hash'])) {
    return resp(req,res,400,{'error':'Invalid username/password combination.'},{});
  }

  req.session.user = passHash.rows[0]['user_uuid'];
  if (req.body.remember_me) {
    let twoWeeks = 14 * 24 * 3600 * 1000;
    req.session.cookie.expires = new Date(Date.now() + twoWeeks);
    req.session.cookie.maxAge = twoWeeks;
  }
  return resp(req,res,200,{},{});
}
