/** Config for mule responses */
module.exports = {
  "senderNoAccount" : "You must have an account to use this command. Please visit the mule sanctuary with `!mule register`. Don't forget to link your account in `Settings`.",
  "noMule"          : "You do not have a mule. Please visit the mule sanctuary with `!mule register`.",
  "redisError"      : "Oops! There was a problem trying to process your request!",
  "registerExists"  : "You already have a mule linked to this account. Please unlink this account from your existing mule before trying to register a new mule.",
  "createUserError" : "Oops! There was a problem trying to fetch you a mule!",
  "alreadyLinked"   : "You already have a linked wallet. Please use `!mule unlink` to unlink existing wallet.",
  "noLink"          : "You don't have a linked wallet. Use `!mule link` to link a Web3 wallet.",
  "unlinkError"     : "Oops! There was a problem unlinking your wallet.",
  "balanceError"    : "Oops! Cannot find a balance at this time!",
  "invalidUser"     : function (user) { return "I've never heard of " +  String(user) + " before."},
  "userNoWallet"    : "You do not have a mule or linked wallet. Please visit the mule sanctuary with `!mule register`.",
  "targetNoAddress" : function (user) { return "No address was found for " + String(user) +"."},
  "invalidNetwork"  : function (network) { return "Your mule checked the A-Z of metaverses and couldn’t find `#" + String(network) + "`. For a list of metaverses, type `!mule metaverse list`." },
  "invalidSend"     : "Oops! Something is wrong with this send request.",
  "targetNoWallet"  : function (user) { return user + ' does not have a mule. Please ask them to visit the mule sanctuary with `!mule register`.' },
}
