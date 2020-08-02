/**
 * @module Client Route Handler
 * @category API
 * @subcategory Client
 */
module.exports = {
  'register'            : require('../Routes/Portal/register.js'),
  'login'               : require('../Routes/Portal/login.js'),
  'is-logged-in'        : require('../Routes/Portal/isLoggedIn.js'),
  'logout'              : require('../Routes/Portal/logout.js'),
  'get-account-info'    : require('../Routes/Portal/getAccountInfo.js'),
  'get-account-balances': require('../Routes/Portal/getAccountBalances.js'),
  'get-favorite-tokens' : require('../Routes/Portal/getFavoriteTokens.js'),
  'get-wallet'          : require('../Routes/Portal/getWallet.js'),
  'add-favorite'        : require('../Routes/Portal/addFavorite.js'),
  'delete-favorite'     : require('../Routes/Portal/delFavorite.js'),
  'signature-message'   : require('../Routes/Portal/signatureMsg.js'),
  'recover'             : require('../Routes/Portal/recover.js'),
  'signature-verify'    : require('../Routes/Portal/signatureVerify.js'),
  'unlink-stash'        : require('../Routes/Portal/unlinkStash.js'),
  'set-default'         : require('../Routes/Portal/setDefault.js'),
  'set-network'         : require('../Routes/Portal/setNetwork.js'),
  'authorize-discord'   : require('../Routes/Portal/authorizeDiscord.js'),
  'authorize-telegram'  : require('../Routes/Portal/authorizeTelegram.js'),
  'unlink-platform'     : require('../Routes/Portal/unlinkPlatform.js'),
  'delete-account'      : require('../Routes/Portal/deleteAccount.js'),
  'change-password'     : require('../Routes/Portal/changePassword.js'),
  'check-link'          : require('../Routes/Portal/renewLink.js')
}
