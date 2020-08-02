/**
 * @module /get-mule/:user
 * @category API
 * @subcategory Public
 */
/**
 * /get-mule/:user
 * @param {string} :user - Mule name
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.params ||
      !req.params.user
    ) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

  let account = await mule.sql.query('web', 'getMule', [String(req.params.user)]);
  if (!account || account.rowCount < 1) {
    return resp(req,res,400,{'error':'No account found'},{});
  }

  let linked = [];
  linked.push({'platform': 'Discord', 'linked': Boolean(account.rows[0]['discord_id']), 'username': (account.rows[0]['discord_username'] != null ? account.rows[0]['discord_username'] : '')});
  linked.push({'platform': 'Telegram', 'linked': Boolean(account.rows[0]['telegram_id']), 'username': (account.rows[0]['telegram_username'] != null ? account.rows[0]['telegram_username']: '')});

  let accountInfo = {
    mule: account.rows[0]['mule_name'],
    address: account.rows[0]['is_internal'] ? account.rows[0]['address'] : account.rows[0]['e_address'],
    linked: linked,
  }

  return resp(req,res,200,{},accountInfo);

}
