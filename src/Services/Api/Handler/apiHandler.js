/**
 * @module API Route Handler
 * @category API
 * @subcategory Public
 */

module.exports = {
  'create-tx'           : require('../Routes/Api/createTx.js'),
  'create-token'        : require('../Routes/Api/createToken.js'),
  'get-tx/:key'         : require('../Routes/Api/getTx.js'),
  'get-balance'         : require('../Routes/Api/getBalance.js'),
  'get-mule/:user'      : require('../Routes/Api/getMule.js'),
  'token-list/:network' : require('../Routes/Api/tokenList.js'),
  'get-creator-tokens'  : require('../Routes/Api/creatorTokens.js'),
  'request-signature'   : require('../Routes/Api/requestSignature.js'),
  'user'                : require('../Routes/Api/profileSearch.js'),
  'address-user'        : require('../Routes/Api/lookup.js'),
  'has-item'            : require('../Routes/Api/hasItem.js'),
  'get-signature-request/:key'      : require('../Routes/Api/getSignatureRequest.js')
}
