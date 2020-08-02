const Web3  = require('web3');
const axios = require('axios');

/** Web3 Adapter */
class Web3Adapter {
  /**
   * Create adapter
   * @param {Object} provider - Web3 provider
   * @param {string} network - Network of provider
   */
  constructor(provider, network) {
    this.provider = provider;
    this.network  = network;
    this.web3     = false;
  }

  /**
   * Connect to web3 provider
   */
  async connect() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
  }

  /**
   * Create transaction
   * @param {string} toAddress - Address to receive transaction
   * @param {string} fromAddress - Address sending the transaction
   * @param {string} [value='0'] - Value of the transaction
   * @param {string} gas - Estimated gas to be used by transaction
   * @param {Object} [data=false] - Data for the transaction
   */
  async createTx(toAddress, fromAddress, value = '0', gas, data = false) {
    let nonce;
    try {
      nonce = await this.web3.eth.getTransactionCount(fromAddress)
    } catch(ex) {
      return {'error': 'Cannot find address nonce'};
    }

    if (data) { value = '0'}

    let rawTx = {
      from  : fromAddress,
      nonce : await this.web3.utils.toHex(nonce.toString()),
      to    : toAddress,
      value : await this.web3.utils.toHex(this.web3.utils.toWei(value.toString())),
    }

    if (data) {
      rawTx['data'] = data;
    }

    let feeInfo = await this.getFees(rawTx, value, gas);
    if (!feeInfo) {
      return {'error': 'Could not get gas costs'}
    }

    rawTx['gas']      = await this.web3.utils.toHex(feeInfo.gas);
    rawTx['gasPrice'] = await this.web3.utils.toHex(this.web3.utils.toWei(feeInfo.gasPrice.toString(), 'gwei'));

    let currentBalance = await this.getBalance(fromAddress, true);
    if (BigInt(currentBalance) < BigInt(feeInfo.totalWei)) {
      return {'error': 'Your mule is not carrying enough money!'}
    }

    return {'raw_tx': rawTx, 'cost_info': feeInfo}

  }

  /**
   * Get gas price / gas total cost
   * @param {Object} rawTx - Raw transaction
   * @param {string} value - Value of transaction
   * @param {string} [gas=false] - Estimated gas to be used by transaction
   */
  async getFees(rawTx, value, gas = false) {
    let feeInfo = {
      gas       : gas,
      gasPrice  : false,
      gasTotalEth   : false,
      totalEth     : false,
    }

    if (!gas) {
      try {
        gas = await this.web3.eth.estimateGas(rawTx);
      } catch(ex) {
        gas = 21000;
      }
    }
    feeInfo['gas'] = gas.toString();

    let gasPrice = await this.getGasPrice();

    feeInfo['gasPrice'] = await this.web3.utils.fromWei(gasPrice, 'gwei');
    feeInfo['gasEth'] = await this.web3.utils.fromWei(gas.toString(), 'ether').toString();
    feeInfo['gasPriceEth'] = await this.web3.utils.fromWei(gasPrice, 'ether').toString();

    let weiValue = await this.web3.utils.toWei(value.toString(), 'ether')
    let totalWei = (BigInt(gas) * BigInt(gasPrice)) + BigInt(weiValue)
    feeInfo['totalWei'] = totalWei.toString();
    feeInfo['totalEth'] = await this.web3.utils.fromWei(totalWei.toString(), 'ether');

    let feeTotal = (BigInt(gas) * BigInt(gasPrice))
    feeInfo['gasTotalEth'] = await this.web3.utils.fromWei(feeTotal.toString(), 'ether');

    return feeInfo;
  }

  /**
   * Get gas price
   */
  async getGasPrice() {
    let gasPrice;
    let getGasPrice = await this.ethGasStation();
    if (getGasPrice) {
      gasPrice = getGasPrice;
    } else {
      try {
        let gasEst = await this.web3.eth.getGasPrice();
        if (!gasEst) {
          throw 'Req Failed'
        }
        gasPrice = gasEst
      } catch(ex) {
        gasPrice = '5000000000';
      }
    }
    return gasPrice;
  }

  /**
   * Get gas price from eth gas station
   */
  async ethGasStation() {
    try {
      let getGasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      if (getGasPrice || getGasPrice.data || getGasPrice.data.average) {
        let gasPrice = await this.web3.utils.toWei((parseFloat(getGasPrice.data.average, 10) / 10).toString(), 'gwei');
        return gasPrice;
      }
      return false;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Get balance
   * @param {string} address - Address querying balance for
   * @param {boolean} wei - return balance as WEI
   */
  async getBalance(address, wei = false) {
    try {
      let weiBalance = await this.web3.eth.getBalance(address);
      if (wei) {
        return weiBalance;
      }
      let ethBalance = await this.web3.utils.fromWei(weiBalance, 'ether');
      return ethBalance;
    } catch(ex) {
      return false;
    }
  }

}

module.exports = Web3Adapter;
