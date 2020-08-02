/**
 * @module Wallet
 * @category Bot Commands
 */

/**
 * Wallet
 * @param {Object} message - Message class
 * @param {Object} mule - Mule class
 * @param {Object} user - GetUser DB query
 */
module.exports = async(message, mule, user) => {
  let wallet = user.rows[0]['is_internal'] ? 'Mule' : 'Stash';
  let address = (wallet == 'Mule' ? user.rows[0]['address'] : user.rows[0]['e_address']);
  return [wallet + ': ' + address, true];
}
