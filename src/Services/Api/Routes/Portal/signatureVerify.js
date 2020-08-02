const { v4: uuidv4 } = require('uuid');
const ethUtil = require('ethereumjs-util');

/**
 * @module /signature-verify
 * @category API
 * @subcategory Client
 */
/**
 * /signature-verify
 * @param {string} req.body.signaure - signed message
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body || !req.body.signature || req.body.signature.indexOf('0x') != 0) {
    return resp(req,res,400,{'error': 'Invalid request.'},{});
  }
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  if(!req.session.sigMsg) {
    return resp(req,res,401,{'error': 'No message for user to verify.'},{});
  }

  let sigAddr;
  try {
    let bufferAddress   = ethUtil.toBuffer('0x' + Buffer.from(req.session.sigMsg).toString('hex'));
    let msgHash         = ethUtil.hashPersonalMessage(bufferAddress);
    let sig             = ethUtil.toBuffer(req.body.signature)
    let sigParams       = ethUtil.fromRpcSig(sig)
    let publicKey       = ethUtil.ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s)
    let sender          = ethUtil.publicToAddress(publicKey)
    sigAddr             = ethUtil.bufferToHex(sender)
  } catch(ex) {
    return resp(req,res,400,{'error':'Bad signature.'},{});
  }

  if (sigAddr.length != 42 && sigAddr.indexOf('0x') != 0) {
    return resp(req,res,400,{'error':'Bad signature.'},{});
  }

  let checkAddr = await mule.sql.query('web', 'checkStash', [req.session.user]);
  if (checkAddr && checkAddr.rowCount > 0 && checkAddr.rows[0]['e_address'] != null) {
    return resp(req,res,400,{'error':'User already has linked account.'},{});
  }

  let addressExists = await mule.sql.query('web', 'addressExists', [sigAddr]);
  if (addressExists && addressExists.rowCount > 0 && addressExists.rows[0]['user_uuid'] != null) {
    return resp(req,res,400,{'error':'Address already linked to an account.'},{});
  }

  let addStash = await mule.sql.query('web', 'addStash', [req.session.user, sigAddr]);
  if (!addStash || addStash.rowCount < 1 || addStash.rows[0]['e_address'] == null) {
    return resp(req,res,500,{'error':'Internal Error.'},{});
  }

  return resp(req,res,200,{}, {});
}
