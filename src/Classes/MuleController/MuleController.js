/* Configs */
const cfg       = require('../../Config/config.js');
const muleRes   = require('../../Config/muleRes.js');
const netInfo   = require('../../Config/networkDescriptions.js');

/* Local */
const Sql       = require('../Sql/SqlController.js');
const Web3Ctrl  = require('../Web3/Web3Controller.js');
const Redis     = require('../Redis/RedisController.js');
const OpenSea   = require('../OpenSea/OpenSea.js');
const Api       = require('../ApiRequest/ApiRequest.js');
const CommandRouter = require('../Router/CommandRouter.js');

/* NPM */
const logger   = require('../../Logger/log.js');

/** Class for mule core functions */
class MuleController {
  /**
   * Create mule core for a service
   * @param {Object} client - Client object to create mule core for (API, Discord, Telegram, etc.)
   */
  constructor(client) {
    this.client = client;
    this.cfg    = cfg;
    this.sql    = new Sql(cfg, logger);
    this.web3   = new Web3Ctrl(cfg, logger);
    this.redis  = new Redis(cfg, logger);
    this.api    = new Api(cfg, logger);
    this.router = new CommandRouter();
    this.os     = OpenSea;
    this.logger = logger
  }

  /**
   * Get mule default response
   * @param {string} type - Type of response
   * @param {string} arg - Custom argument for some responses
   */
  async response(type, arg) {
    if (arg) {
      return muleRes[type](arg);
    }
    return muleRes[type];
  }

  /**
   * Get network information
   * @param {string} network
   */
  async netInfo(network) {
    if (netinfo && netInfo[network]) {
      return netinfo[network];
    }
    return 'Invalid Network!';
  }

  /**
   * Get formatted metaverse
   * @param {string} network
   */
  async metaverse(network) {
    if (network == 'mainnet' || network == 'ethereum') {
      return "#Ethereum :unicorn:"
    } else if (network == 'rinkeby') {
      return "#Rinkeby :test_tube: :unicorn:"
    } else if (network == 'kovan') {
      return "#Kovan :test_tube: :unicorn:"
    } else if (network == 'matic') {
      return "#Matic :rocket:"
    } else if (network == 'matic-mumbai') {
      return "#Matic Mumbai :rocket: :test_tube:"
    }
  }
}

module.exports = MuleController;
