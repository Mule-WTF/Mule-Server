/**
 * @module /get-wallet
 * @category API
 * @subcategory Client
 */
/**
 * /get-wallet
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.session || !req.session.user) {
    return resp(req,res,401,{'error':'User is not logged in.'},{});
  }
  let account = await mule.sql.query('web', 'getAccount', [req.session.user]);
  if (!account || account.rowCount < 1) {
    return resp(req,res,500,{'error':'Internal error'},{});
  }

  let walletInfo = {
    mule: account.rows[0]['mule_name'],
    address: account.rows[0]['address'],
    stash_address: account.rows[0]['e_address'],
    default_address: account.rows[0]['is_internal'] ? account.rows[0]['address'] : account.rows[0]['e_address'],
    network: account.rows[0]['network'],
    keystore: account.rows[0]['keystore'],
  }

  return resp(req,res,200,{},walletInfo);

}
