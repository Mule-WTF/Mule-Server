const { v4: uuidv4 } = require('uuid');

/**
 * @module /signature-message
 * @category API
 * @subcategory Client
 */
/**
 * /signature-message
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  let msg = uuidv4();
  if (!msg) {
    return resp(req,res,500,{'error': 'Internal error.'},{})
  }
  req.session.sigMsg = msg;

  return resp(req,res,200,{}, {'sigMsg': msg});
}
