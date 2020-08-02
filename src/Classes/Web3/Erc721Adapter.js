const ABI = require('./ABI/erc721.abi');
const axios = require('axios');

/** ERC-721 Adapter */
class Erc721Adapter {
  constructor() {
    this.web3 = false;
    this.contractAddress = false;
    this.contract = false;
  }

  /**
   * Start Adapter
   * @param {Object} web3 - Web3 provider
   * @param {string} contractAddress - Contract address for adapter
   */
  async init(web3, contractAddress) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.contract = new this.web3.eth.Contract(ABI, contractAddress);
  }

  /**
   * Transfer NFT
   * @param {string} to - Receiver address
   * @param {string} token_id - token to transfer
   * @param {string} from - Sender address
   */
  async transfer(to, token_id, from) {
    let owner = await this.getOwner(from, token_id);
    if (!owner) {
      return {'error': 'Address does not own this token!'};
    }

    let gasEst = await this.estimateGas(to, token_id, from);
    if (!gasEst) {
      return {'error': 'Gas estimation error!'};
    }

    let encodeData = await this.encodeABI(to, token_id, from);
    if (!encodeData) {
      return {'error': 'Encoding ABI error!'};
    }

    return {
      'data': encodeData,
      'gas' : gasEst,
      'contract': this.contractAddress
    }
  }

  /**
   * Get owner of NFT
   * @param {string} address - Address to check if owner
   * @param {string} token_id - ID of token to check ownership of
   */
  async getOwner(address, token_id) {
    try {
      let owner = await this.contract.methods.ownerOf(token_id).call();
      if (owner.toLowerCase() != address.toLowerCase()) {
        throw "Not Owner";
      }
      return true;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Estimate gas cost
   * @param {string} to - Receiver address
   * @param {string} token_id - ID of NFT being sent
   * @param {string} from - Sender address
   */
  async estimateGas(to, token_id, from) {
    try {
      let gas = await this.contract.methods.transferFrom(from, to, token_id).estimateGas({'from': from});
      return gas;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Encode transfer to be signed by sender
   * @param {string} to - Receiver address
   * @param {string} token_id - ID of NFT being sent
   * @param {string} from - Sender address
   */
  async encodeABI(to, token_id, from) {
    try {
      let data = await this.contract.methods.transferFrom(from, to, token_id).encodeABI();
      return data;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Get contract name, token name, token image, id
   * @param {string} id - ID of the NFT
   */
  async tokenInfo(id) {
    let [tokenName, tokenImage] = await this.getMetadata(id);
    let contractName = await this.contractName();
    return {
      contract_name: contractName,
      token_name: tokenName,
      token_image: tokenImage,
      id: id
    }
  }

  /**
   * Get the contract name
   */
  async contractName() {
    try {
      let contractName = await this.contract.methods.name().call();
      return contractName;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Get metadata for the token
   * @param {string} token_id - ID of the NFT
   */
  async getMetadata(token_id) {
    try {
      let metadataURI = await this.contract.methods.tokenURI(token_id).call();
      let [name, image] = await this.metadata(metadataURI);
      return [name, image];
    } catch(ex) {
      return [false, false]
    }
  }

  /**
   * Fetch metadata from URI
   * @param {string} URI - FQDN to fetch metadata from
   */
  async metadata(URI) {
    try {
      let req = await axios.get(URI, {timeout: 5000});
      if (!req.data) {
        throw 'bad uri';
      }
      let name = req.data.name ? req.data.name : (req.data.properties && req.data.properties && req.data.properties.name ? req.data.properties.name : false);
      let image = req.data.image ? req.data.image : (req.data.properties && req.data.properties && req.data.properties.image ? req.data.properties.image : false);
      return [name, image];
    } catch(ex) {
      return [false, false];
    }
  }

}
module.exports = Erc721Adapter;
