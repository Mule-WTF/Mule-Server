const cfg           = require('../../../../Config/webConfig.js');
const DiscordOauth2 = require("discord-oauth2");
const oauth         = new DiscordOauth2();

/**
 * @module /authorize-discord
 * @category API
 * @subcategory Client
 */
/**
 * /authorize-discord
 * @param {string} code - Code from discord oAuth
 * @param {}
 */
module.exports = async(req,res) => {
  let resp = res.locals.resp;
  let mule = res.locals.mule;
  if (!req.body ||
      !req.body.code ||
      !req.session ||
      !req.session.user
  ) {
    return resp(req,res,400,{'error':'Invalid request'},{});
  }

  let redirect;
  if (cfg.PRODUCTION == 1) {
    redirect = "http://api.mule.wtf/authorize-discord"
  } else if (cfg.PRODUCTION == 2) {
    redirect = "https://lab.mule.wtf/authorize-discord"
  } else {
    redirect = "http://127.0.0.1:3000/authorize-discord"
  }
  let getToken = await oauth.tokenRequest({
    clientId: cfg.DISCORD_CLIENT_ID,
    clientSecret: cfg.DISCORD_SECRET,
    code: req.body.code,
    scope: "identify",
    grantType: "authorization_code",
    redirectUri: redirect
  });

  if (!getToken || !getToken.access_token) {
    return resp(req,res,400,{'error':'Invalid code'},{});
  }

  let discordUser = await oauth.getUser(getToken.access_token)
  if (!discordUser || !discordUser.username || !discordUser.id) {
    return resp(req,res,400,{'error':'Could not get user.'},{});
  }

  let socialExists = await mule.sql.query('web', 'socialIdExists', [discordUser.id]);
  if (socialExists) {
    return resp(req,res,400,{'error': 'Discord user already linked to an account'},{});
  }

  let platformExists = await mule.sql.query('web', 'getAccount', [req.session.user]);
  if (!platformExists || platformExists.rowCount < 1) {
    return resp(req,res,400,{'error': 'No account found.'},{});
  }
  if (platformExists.rows[0]['discord_id'] != null) {
    return resp(req,res,400,{'error': 'Platform already linked.'},{});
  }

  let updateLink = await mule.sql.query('web', 'updateLink', ['discord', req.session.user, discordUser.id, discordUser.username + '#' + discordUser.discriminator]);
  return resp(req,res,200,{},{});

}
