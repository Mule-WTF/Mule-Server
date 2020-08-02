/**
 * @module /set-default
 * @category API
 * @subcategory Client
 */
/**
 * /set-default
 * @param {string} req.body.wallet - default wallet, "stash" or "mule"
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error': 'User is not logged in.'},{});
  }

  let types = ['mule', 'stash']
  if (!req.body || !req.body.wallet || types.indexOf(req.body.wallet) < 0) {
    return resp(req,res,401,{'error': 'Invalid request.'},{});
  }

  let defaultWallet = await mule.sql.query('web', 'defaultWallet', [req.session.user]);
  if (!defaultWallet || defaultWallet.rowCount < 1) {
    return resp(req,res,501,{'error': 'Internal error.'},{});
  }
  let isMule = defaultWallet.rows[0]['is_internal'];

  if (isMule && req.body.wallet == 'mule' || !isMule && req.body.wallet == 'stash') {
    return resp(req,res,200,{}, {});
  }

  let setWallet;
  if (req.body.wallet == 'mule') {
    setWallet = await mule.sql.query('web', 'setWallet', [req.session.user, 't']);
  } else {
    let checkAddr = await mule.sql.query('web', 'checkStash', [req.session.user]);
    if (!checkAddr || checkAddr.rowCount < 1 || checkAddr.rows[0]['e_address'] == null) {
      return resp(req,res,400,{'error':'User does not have stash wallet.'},{});
    }
    setWallet = await mule.sql.query('web', 'setWallet', [req.session.user, 'f']);
  }

  if (!setWallet || setWallet.rowCount < 1 || !setWallet.rows[0]['user_uuid']) {
    return resp(req,res,500,{'error':'Internal error.'},{});
  }

  return resp(req,res,200,{}, {});
}
