const cfg = require('../Config/muleConfig.js');
/**
 * @module Commands
 * @category Bot Commands
 */

/**
 * Commands
 */
module.exports = async() => {
  let commandList = `
For command usage help, use {command} help.

help      : Help about all things Mule.
register  : Get your first mule.
profile   : View a user profile.
send      : Send Loot and gear across the metaverse.
balance   : View Loot balances.
favorite  : Loot to display in balances.
address   : View a raw address for a user.
poop      : Help the environment.
stash     : Send from mule to linked wallet/Toggle wallet
unstash   : Send from linked wallet to mule/Toggle wallet
metaverse : View / Change metaverse.

{user} - @{username}, {username}@{platform}, {id}@{platform}
Examples: @Cr0wn_Gh0ul, Cr0wn_Gh0ul@mule, Cr0wn_Gh0ul#6666@discord, Cr0wn_Gh0ul@telegram

{token} - Token contract address
`
  return [commandList, true];
}
