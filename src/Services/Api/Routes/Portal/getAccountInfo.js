/**
 * @module /get-account-info
 * @category API
 * @subcategory Client
 */
/**
 * /get-account-info
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

  let linked = [];
  linked.push({'platform': 'Discord', 'linked': Boolean(account.rows[0]['discord_id']), 'username': (account.rows[0]['discord_username'] != null ? account.rows[0]['discord_username'] : '')});
  linked.push({'platform': 'Telegram', 'linked': Boolean(account.rows[0]['telegram_id']), 'username': (account.rows[0]['telegram_username'] != null ? account.rows[0]['telegram_username']: '')});

  let metaverse = await mule.metaverse(account.rows[0]['network']);

  let accountInfo = {
    mule: account.rows[0]['mule_name'],
    address: account.rows[0]['address'],
    stash_address: account.rows[0]['e_address'],
    default_address: account.rows[0]['is_internal'] ? account.rows[0]['address'] : account.rows[0]['e_address'],
    network: account.rows[0]['network'],
    keystore: account.rows[0]['keystore'],
    linked: linked,
    metaverse: metaverse
  }

  return resp(req,res,200,{},accountInfo);

}
