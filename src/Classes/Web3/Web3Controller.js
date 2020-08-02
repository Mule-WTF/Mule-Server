const Web3Adapter       = require('./Web3Adapter.js');
const WebsocketAdapter  = require('./WebsocketAdapter.js');
const EnsAdapter        = require('./ENS.js');
const Erc20Adapter      = require('./Erc20Adapter.js');
const Erc721Adapter     = require('./Erc721Adapter.js');
const Factory           = require('./Factory.js');
const EnjinAdapter      = require('./EnjinAdapter.js');

/** Web3 Main Controller */
class Web3Controller {
  /**
   * Create Controller
   * @param {Object} cfg - Configuration settings
   * @param {Object} logger - Logger
   */
  constructor(cfg, logger) {
    this.cfg     = cfg;
    this.logger  = logger;

    this.addAllAdapters();

    this.mainnet = false;
    this.rinkeby = false;
    this.kovan   = false;
    this.matic   = false;
    this["matic-mumbai"]   = false;
    this.ens     = false;
    this.enjin   =

    this.wss    = new WebsocketAdapter();

    this.networks   = ['mainnet', 'rinkeby', 'kovan', 'matic', 'matic-mumbai'];
    this.erc20      = new Erc20Adapter();
    this.erc721     = new Erc721Adapter();
    this.factory    = new Factory();
  }

  /**
   * Add all available http adapters
   */
  async addAllAdapters() {
    await this.addAdapter('mainnet', 'https://mainnet.infura.io/v3/' + this.cfg.INFURA_ID);
    await this.addAdapter('rinkeby', 'https://rinkeby.infura.io/v3/' + this.cfg.INFURA_ID);
    await this.addAdapter('kovan', 'https://kovan.infura.io/v3/' + this.cfg.INFURA_ID);
    await this.addAdapter('matic', 'https://rpc-mainnet.matic.network');
    await this.addAdapter('matic-mumbai', 'https://rpc-mumbai.matic.today');
    return true;
  }
  /**
   * Add all available websocket adapters
   */
  async addWebsocketAdapters() {
    await this.wss.add('mainnet', 'wss://mainnet.infura.io/ws/v3/' + this.cfg.INFURA_ID);
    await this.wss.add('rinkeby', 'wss://rinkeby.infura.io/ws/v3/' + this.cfg.INFURA_ID);
    await this.wss.add('kovan', 'wss://kovan.infura.io/ws/v3/' + this.cfg.INFURA_ID);
    await this.wss.add('matic', 'wss://ws-mainnet.matic.network');
    await this.wss.add('matic-mumbai', 'wss://ws-mumbai.matic.today');

    return true;
  }

  /**
   * Add adapter
   * @param {string} network - network for adapter
   * @param {string} provider - provider URL for adapter connection
   */
  async addAdapter(network, provider) {
    if (this[network]) {
      return true;
    }

    let adapter = new Web3Adapter(provider, network);
    await adapter.connect();
    this[network] = adapter;
    if (network == 'mainnet') {
      try {
        this.ens = new EnsAdapter(adapter.web3);
      } catch(ex) {
        this.logger.warn('ENS not connected: ' + ex);
      }
      try {
        this.enjin = new EnjinAdapter(adapter.web3);
        await this.enjin.init()
      } catch(ex) {
        this.logger.warn('Enjin Adapter not connected: ' + ex);
      }
    }
  }

  /**
   * Get a network adapter
   */
  async getAdapter(network) {
    if (!this[network]) {
      return false;
    }
    return this[network];
  }

  /**
   * Get ERC20 contract adapter with network provider
   * @param {string} network - Network for contract
   * @param {string} contractAddr - ERC20 contract address
   */
  async ERC20Adapter(network, contractAddr) {
    if (!this[network]) {
      return false;
    }

    if (!contractAddr || contractAddr.length != 42 || contractAddr.indexOf("0x") != 0) {
      return false;
    }

    await this.erc20.init(this[network].web3, contractAddr);
    return this.erc20;
  }

  /**
   * Get ERC721 contract adapter with network provider
   * @param {string} network - Network for contract
   * @param {string} contractAddr - ERC721 contract address
   */
  async ERC721Adapter(network, contractAddr) {
    if (!this[network]) {
      return false;
    }

    if (!contractAddr || contractAddr.length != 42 || contractAddr.indexOf("0x") != 0) {
      return false;
    }

    await this.erc721.init(this[network].web3, contractAddr);
    return this.erc721;
  }

  /**
   * Enjin adapter
   * @param {string} targetAddress - Address to get enjin information about
   */
  async EnjinAdapter(targetAddress) {
    return this.enjin
  }

  /**
   * Mule contract factory adapter
   * @param {string} network - Network for factory contract
   */
  async factoryAdapter(network) {
    if (!this[network]) {
      return false;
    }

    await this.factory.init(this[network].web3, network);
    return this.factory;

  }

  /**
   * ENS lookup (mainnet only)
   * @param {string} domain - ENS name
   */
  async ENS(domain) {
    if (!this.ens) {
      return false;
    }
    let address = await this.ens.lookup(domain);
    return address;
  }
}
module.exports = Web3Controller;
