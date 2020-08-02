const txAddress = require('../../Utils/txAddress.js');

/**
 * @module /has-item
 * @category API
 * @subcategory Public
 */

/**
 * /has-item
 * @param {string} req.body.user - User [mule name, platform username]
 * @param {string} [req.body.platform = false] - Platform the user is from, unless address or ENS
 * @param {string} req.body.contract - Contract address of the token
 * @param {string} [req.body.token_id = false] - token id
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body ||
      !req.body.user ||
      !req.body.platform ||
      !req.body.contract
    ) {
      return resp(req,res,400,{'error': 'Invalid request.'},{});
  }

  let platforms = ['mule', 'discord', 'telegram'];
  let platform = platforms.indexOf(req.body.platform) < 0 ? 'mule' : req.body.platform;
  let network = 'mainnet';
  if (req.body.network) {
    network = req.body.network.replace('ethereum', 'mainnet');
  }

/* single Address / ens */

  let addresses = await mule.sql.query('api', 'multiAddress', [String(req.body.user), platform]);
  if (!addresses || addresses.rowCount < 1) {
    return resp(req,res,400,{'error': 'User not found.'},{});
  }
  let target = [];
  target.push(addresses.rows[0]['address']);
  if (addresses.rows[0]['e_address']) { target.push(addresses.rows[0]['e_address']) }

  let hasItem;
  for (i = 0; i < target.length; i++) {
    let os = new mule.os(network);
    let inventory = await os.getInventoryApi(target[i], req.body.contract, req.body.token_id);
    if (inventory) {
      hasItem = true;
      break;
    }
  }

  return resp(req,res,200,{},{has_item: hasItem});
}
