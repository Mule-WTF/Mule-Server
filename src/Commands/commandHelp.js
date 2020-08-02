const cfg = require('../Config/muleConfig.js');

/**
 * @module Command Help
 * @category Bot Commands
 */

/**
 * Command Help
 * @param {string} cmd - Command to get help for
 */
module.exports = async(cmd) => {
  let res = {};
  switch(cmd) {
    case 'profile':
      res['help'] = "profile - View your user profile\n\nprofile {user} - View another user's profile"
      break;
    case 'register':
      res['help'] = 'register - Link to registration page (on discord this link will automatically link your account.)'
      break;
    case 'send':
      res['help'] = 'send {user} {amount} {loot || loot contract} - Send loot or custom loot.\n\nsend {user} {gear_contract/gear_id || OpenSea URL} - Send gear.\n\nSupported Loot: Eth; ERC20; Other native currencies.\nSupported Gear: ERC721'
      break;
    case  'balance':
      res['help'] = 'balance - View loot in your metaverse.\n\n{user} - View users loot in your metaverse.\n\nof {loot} - Specific loot or custom loot.\n\non {metaverse} - Select metaverse.\n\n*{user}, on {metavserse}, of {loot} are optional and can be combined.'
      break;
    case 'favorite': case 'favourite':
      res['help'] = 'favorite || favourite - View your favorite loot.\n\nadd {loot || loot_contract} - Add favorite loot, shown in balance command.\n\nremove {loot} - Remove loot from your favorites.'
      break;
    case 'address':
      res['help'] = 'address - View raw address for your current wallet.\n\n{user} - View raw address for another users current wallet.\n\n{ENS} - ENS (Ethereum Name Service) to address.'
      break;
    case 'stash':
      res['help'] = 'stash - Switch to stash wallet.\n\n{amount} {eth || loot || loot_contract || gear_contract/gear_id || OpenSea URL} - Send from mule to linked wallet.'
      break;
    case 'unstash':
      res['help'] = 'unstash - Switch to mule wallet.\n\n{amount} {eth || loot || loot_contract || gear_contract/gear_id || OpenSea URL} - Send from linked wallet to mule.'
      break;
    case 'metaverse':
      res['help'] = 'metaverse - View current metaverse.\n\n{metaverse} - Teleport to another metaverse.\n\n{metaverse} info - Display information about a metaverse.\n\nlist - View metaverses within teleportation range.'
      break;
    case 'poop':
      res['help'] = 'Mule cannot help you poop, try a laxative.'
      break;
    case 'help':
      res['help'] = 'Please try turning it off and back on again.'
      break;
  }

  return [res, true];


}

