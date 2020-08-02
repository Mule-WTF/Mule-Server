const crypto    = require('crypto');
const validator = require('validator');
const bcrypt    = require('bcrypt');

/**
 * @module /register
 * @category API
 * @subcategory Client
 */
/**
 * /register
 * @param {string} req.body.keystore - keystore file contents
 * @param {string} req.body.name - mule name
 * @param {string} req.body.password_hash - password hash
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  if (!req.body ||
      !req.body.keystore ||
      !req.body.keystore.address ||
      !req.body.name ||
      !req.body.password_hash
  ) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }

  try {
    JSON.parse(JSON.stringify(req.body.keystore));
  } catch(ex) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }
  let keystore = JSON.stringify(req.body.keystore);

  if (req.body.keystore.address.length !== 40 || !validator.isHexadecimal(req.body.keystore.address)) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }
  let address = '0x' + req.body.keystore.address;

  if (!validator.isHash(String(req.body.password_hash), 'sha256')) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }
  let password_hash = req.body.password_hash;

  let validChars = /^[0-9a-zA-Z_-]+$/;
  if (!validChars.test(req.body.name) || req.body.name.length > 32 || req.body.name.length < 5) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }
  let name = req.body.name;

  let mule = res.locals.mule;

  let nameHash = await crypto.createHash('sha256').update(String(name)).digest('hex');

  let hashedPassword = String(bcrypt.hashSync(nameHash + password_hash, 10));

  let muleExists = await mule.sql.query('web', 'muleExists', [String(name)]);
  if (muleExists || (muleExists.rowCount > 0 && muleExists.rows[0]['mule_name'] && muleExists.rows[0]['mule_name'].toLowerCase() == name.toLowerCase())) {
    return resp(req,res,400,{'error':'Name already taken'},{'name': 'Already taken.'});
  }
  let addressExists = await mule.sql.query('web', 'addressExists', [String(address)]);
  if (addressExists) {
    return resp(req,res,400,{'error':'Address already taken'},{'general': 'Address taken.'});
  }

  let link_info;
  if (req.body.link_key && validator.isUUID(req.body.link_key, 4)) {
    let link_key = req.body.link_key;
    link_info = await mule.redis.get(link_key);
    link_info = JSON.parse(link_info)
    mule.redis.keystore.del(link_key)
    if (!link_info || !link_info.platform || !link_info.id || !link_info.username) {
      return resp(req,res,400,{'error': 'Invalid or expired link key.'},{'general': 'Bad link key.'});
    }
    let socialExists = await mule.sql.query('web', 'socialIdExists', [link_info.id]);
    if (socialExists) {
      return resp(req,res,400,{'error': link_info.platform + ' account is already linked to another mule'},{'general': link_info.platform + ' account is already linked to another mule.'});
    }
  }

  let newAccount = await mule.sql.query('web', 'createUser', [name, address, hashedPassword, keystore]);
  if (!newAccount || newAccount.rowCount < 1 || !newAccount.rows[0]['user_uuid']) {
    return resp(req,res,500,{'error':'Internal error'},{});
  }

  req.session.user = newAccount.rows[0]['user_uuid'];

  let addLink = await mule.sql.query('web', 'addLink', [newAccount.rows[0]['user_uuid']]);
  if (!addLink || addLink.rowCount < 1) {
    return resp(req,res,200,{},{});
  }
  if (link_info) {
    let updateLink = await mule.sql.query('web', 'updateLink', [link_info.platform, newAccount.rows[0]['user_uuid'], link_info.id, link_info.username]);
  }

  return resp(req,res,200,{},{});
}

