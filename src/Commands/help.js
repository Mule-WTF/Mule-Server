const cfg = require('../Config/muleConfig.js');

/**
 * @module Help
 * @category Bot Commands
 */

/**
 * Help
 * @param {Object} mule - Mule class
 */
module.exports = async(mule) => {
  let guide = "**:horse: Mule is a virtual pet that carries your money and gear around the metaverse. They're your very own walking, talking 4-legged treasure chest and trading post :carrot:**\n\n:woman_farmer: `!mule register` to get your very own Metaverse Mule from our rescue sanctuary. Be sure to **choose a password you can remember** because we can’t help you if you forget!\n\nMule is actually a **non-custodial** crypto wallet protected with your password. In addition, you can link to a Web3 wallet and use it as a second, more secure Stash Wallet.\n\n**Commands:**`!mule commands`\n\n**Mule Friends:** <https://discord.gg/8N5VSEK>\n\n"
  let footer = cfg.VERSION + ' | <https://mule.wtf>';
  if (mule.client == 'discord') {
    return [guide + footer, true];
  } else {
    guide = ":horse: *Mule is a virtual pet that carries your money and gear around the metaverse. They're your very own walking*\,* talking 4-legged treasure chest and trading post* :carrot: \n\n:woman_farmer: `!mule register` to get your very own Metaverse Mule from our rescue sanctuary. Be sure to *choose a password you can remember* because we can’t help you if you forget!\n\nMule is actually a *non-custodial* crypto wallet protected with your password. In addition\, you can link to a Web3 wallet and use it as a second\, more secure Stash Wallet.\n\n*Commands:*`!mule commands`\n\n*Mule Friends:* <https://discord.gg/8N5VSEK>\n\n";
    return [guide, true];
  }
}

