/**
 * @module txAddress
 * @category API
 * @subcategory Utils
 */
/**
 * txAddress
 * @param {Object} mule - mule class
 * @param {string} to - [mule name, address, ENS, platform username]
 * @param {string} platform - platform for to
 */
module.exports = async(mule, to, platform = 'mule') => {
  if (to.length == 42 && to.indexOf('0x') == 0) {
    let muleName = await mule.sql.query('api', 'addressToMule', [to.toLowerCase()]);
    let username;
    if (muleName && muleName.rowCount > 0 && muleName.rows[0] && muleName.rows[0]['mule_name']) {
      username = muleName.rows[0]['mule_name'];
    }
    return [to, username];
  }

  if (to.indexOf('.eth') > 0) {
    let address, username;
    try {
      let getAddress = await mule.web3.ENS(to);
      if (!getAddress) {
        throw 'bad ens'
      }
      address = getAddress;
      let muleName = await mule.sql.query('api', 'addressToMule', [to]);
      let username;
      if (muleName && muleName.rowCount > 0 && muleName.rows[0] && muleName.rows[0]['mule_name']) {
        username = muleName.rows[0]['mule_name'];
      } else {
        username = to;
      }
    } catch(ex) {
      return [false, false];
    }
    return [address, username];
  }

  let isId = /^\d+$/;
  if (isId.test(to)) {
    let address, username;
    try {
      let id = await mule.sql.query('api', 'idToAddress', [to, platform]);
      if (!id || id.rowCount < 1) {
        throw 'id not found';
      }
      if (id.rows[0]['is_internal']) {
        address = id.rows[0]['address'];
      } else {
        address = id.rows[0]['e_address'];
      }
      username = id.rows[0]['mule_name'];
    } catch(ex) {
      return [false, false];
    }
    return [address, username];
  }

  if (to.length < 64) {
    let address, username;
    try {
      username = await mule.sql.query('api', 'usernameToAddress', [to, platform]);
      if (!username || username.rowCount < 1) {
        throw 'username not found';
      }
      if (username.rows[0]['is_internal']) {
        address = username.rows[0]['address'];
      } else {
        address = username.rows[0]['e_address'];
      }
      username = username.rows[0]['mule_name'];
    } catch(ex) {
      return [false, false];
    }
    return [address, username];
  }

  return [false, false];
}
