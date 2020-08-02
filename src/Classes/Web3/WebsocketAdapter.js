const Web3 = require("web3");

/** Websocket Adapter */
class WSS {
  /**
   * Create adapter
   * @param {Object} cfg - Configuration Settings
   */
  constructor(cfg) {
    this.cfg     = cfg
    this.mainnet = false;
    this.rinkeby = false;
    this.kovan   = false;
    this.matic   = false;
    this["matic-mumbai"] = false;
  }

  /**
   * Add WSS adapter
   * @param {string} network - Network of provider
   * @param {Object} provider - Web3 Provider
   */
  async add(network, provider) {
    let wss = new Web3(
      new Web3.providers.WebsocketProvider(provider)
    );
    this[network] = wss;
  }
}
module.exports = WSS;
