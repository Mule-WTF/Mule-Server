/** ENS adapter */
class ENS {
  /**
   * Create adapter
   * @param {Object} web3 - Web3 provider
   */
  constructor(web3) {
    this.web3 = web3;
  }

  /**
   * ENS => 0xAddress
   * @param {string} domain - ENS domain for lookup
   */
  lookup(domain) {
    if (!this.web3) { return false }
    try {
      let address = this.web3.eth.ens.getAddress(domain);
      return address;
    } catch(ex) {
      console.log(ex)
      return false;
    }
  }
}
module.exports = ENS;
