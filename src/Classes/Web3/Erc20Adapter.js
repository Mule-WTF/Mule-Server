const ABI = require('./ABI/erc20.abi');

/** ERC-20 Adapter */
class Erc20Adapter {
  constructor() {
    this.web3 = false;
    this.contractAddress = false;
    this.contract = false;
  }

  /**
   * Start Adapter
   * @param {Object} web3 - Web3 provider
   * @param {string} contractAddress - Contract address for adapter
   * @param {Object} [abi=false] - ABI for contract
   */
  async init(web3, contractAddress, abi = false) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    try {
      this.contract = new this.web3.eth.Contract(abi ? abi : ABI, contractAddress);
    } catch(ex) {
      return false;
    }
  }

  /**
   * Call a contract method
   * @param {stirng} methodName - Contract function name to be called
   * @param {string} from - Address to call function as
   * @param {string} arg - Argument to call function with
   */
  async call(methodName, from, arg) {
    try {
      let response = await this.contract.methods[methodName](arg).call({'from': from});
      return response;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Transfer token
   * @param {string} to - Receiver address
   * @param {string | number} value - Amount of tokens to transfer
   * @param {string} from - Sender address
   */
  async transfer(to, value, from) {
    let balance = await this.getBalance(from);
    if (!balance || parseInt(balance,10) < parseInt(value,10)) {
      return {'error': 'Your mule is not carrying that much!'};
    }

    value = this.web3.utils.toWei(value.toString(), 'ether')
    let gasEst = await this.estimateGas(to, value, from);
    if (!gasEst) {
      return {'error': 'Your mule cannot afford to pay their expenses on this trip!'};
    }

    let encodeData = await this.encodeABI(to, value, from);
    if (!encodeData) {
      return {'error': 'Your mule is confused by this mysterious ABI encoding!'};
    }

    return {
      'data': encodeData,
      'gas' : gasEst,
      'contract': this.contractAddress
    }
  }

  /**
   * Get balance of tokens
   * @param {string} address - Address to query balance of
   */
  async getBalance(address) {
    try {
      let balance = await this.contract.methods.balanceOf(address).call();
      balance = this.web3.utils.fromWei(balance, 'ether');
      return balance;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Estimate gas cost
   * @param {string} to - Receiver address
   * @param {string | number} value - Amount of tokens being sent
   * @param {string} from - Sender address
   */
  async estimateGas(to, value, from) {
    try {
      let gas = await this.contract.methods.transfer(to, value).estimateGas({'from': from});
      return gas;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Encode transfer to be signed by sender
   * @param {string} to - Receiver address
   * @param {string | number} - Amount of tokens being sent
   * @param {string} - Sender Address
   */
  async encodeABI(to, value, from) {
    try {
      let data = await this.contract.methods.transfer(to, value).encodeABI();
      return data;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Get balance and token symbol
   * @param {string} address - Address to query balance of
   */
  async getBalanceAndTick(address) {
    try {
      let balance = await this.contract.methods.balanceOf(address).call();
      balance = this.web3.utils.fromWei(balance, 'ether');
      let symbol = await this.contract.methods.symbol().call();
      return {'balance': balance, 'symbol': symbol}
    } catch(ex) {
      return false;
    }
  }

  /**
   * Get token name and symbol
   */
  async tokenInfo() {
    let name = await this.getName();
    let symbol = await this.getSymbol();
    symbol = symbol ? symbol : name;
    return {
      token_name: name,
      token_symbol: symbol
    }
  }

  /**
   * Get token name
   */
  async getName() {
    try {
      let name = await this.contract.methods.name().call();
      return name;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Get token symbol
   */
  async getSymbol() {
    try {
      let symbol = await this.contract.methods.symbol().call();
      return symbol;
    } catch(ex) {
      return false;
    }

  }

}
module.exports = Erc20Adapter;
