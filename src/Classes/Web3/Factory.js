const ABI = require('./ABI/FactoryABI.js');
const cfg = require('../../Config/config.js');

/** Mule Factory Adapter */
class Factory {
  constructor() {
    this.web3 = false;
    this.network = false;
    this.contract;
    this.contractAddress;
  }

  /**
   * Start MuleTokenFactory adapter
   * @param {Object} web3 - Web3 provider
   * @param {string} network - Network of the provider
   */
  async init(web3, network) {
    if (!web3 || !network) { return false }

    let contractAddress;
    switch (network) {
      case 'rinkeby':
        contractAddress = cfg.RINKEBY_MULE_FACTORY;
        break;
      case 'kovan':
        contractAddress = cfg.KOVAN_MULE_FACTORY;
        break;
      case 'matic':
        contractAddress = cfg.MATIC_MULE_FACTORY;
        break;
      case 'matic-mumbai':
        contractAddress = cfg.MATIC-MUMBAI_MULE_FACTORY;
        break;
      default:
        contractAddress = cfg.MAINNET_MULE_FACTORY;
        break;
    }

    this.web3 = web3;
    this.network = network;
    try {
      let contract = new web3.eth.Contract(ABI, contractAddress);
      this.contract = contract;
      this.contractAddress = contractAddress;
      return true;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Get factory ABI
   */
  getABI() {
    return ABI;
  }

  /**
   * Create token
   * @param {string} name - Name of the token to be created
   * @param {string} supply - Max supply of tokens
   * @param {string} from - Address creating the token
   */
  async createToken(name, supply, from) {
    if (!this.contract) { return false }
    if (!name) { return false }
    if (!supply) { supply = 1000000000 }
    if (!parseInt(supply) || isNaN(parseInt(supply))) { return false }

    let gasEst;
    try {
      gasEst = await this.contract.methods.newToken(name, supply).estimateGas({from: from});
    } catch(ex) {
      return false;
    }

    let newToken;
    try {
      newToken = await this.contract.methods.newToken(name, supply).encodeABI();
    } catch(ex) {
      return false;
    }

    return {
      'data': newToken,
      'gas' : gasEst,
      'contract': this.contractAddress
    }
  }

  /**
   * Get all contract an address has created
   * @param {string} address - Address of creator
   */
  async contractsByCreator(address) {
    if (!this.contract) { return false }
    try {
      let contracts = await this.contract.methods.contractsByCreator(address).call({from:address});
      return contracts;
    } catch(ex) {
     return false;
    }
  }

  /**
   * Get a contract address from token name
   * @param {string} name - Name of the token
   */
  async contractByName(name) {
    if (!this.contract) { return false }
    try {
      let contract = await this.contract.methods.contractByName(name).call({from:address});
      if(contract == '0x0000000000000000000000000000000000000000') { return false }
      return contract;
    } catch(ex) {
      return false;
    }
  }

}

module.exports = Factory;
