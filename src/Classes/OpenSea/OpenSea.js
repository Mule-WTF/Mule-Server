const axios = require('axios');
const cfg = require('../../Config/config.js');

/** TO BE REPLACED BY BLOCKADE GAMES CACHE */
class OpenSea {
  constructor(network) {
    this.network = network;
  }

  async getInventory(address, contractName, itemName) {
    let tokenId = '';
    let contractAddr = '';
    let filter = false;

    if (itemName && isNaN(parseInt(itemName, 10))) {
      itemName = itemName.toLowerCase().replace(/\s/g,'').substring(0,6);
    } else if (itemName) {
      tokenId = '&token_ids=' + itemName;
      filter = true;
    }

    if (contractName && (contractName.length != 42 && contractName.indexOf("0x") != 0)) {
      contractName = contractName.toLowerCase().replace(/\s/g,'').substring(0,6);
    } else if (contractName) {
      contractAddr = '&asset_contract_address=' + contractName;
      filter = true;
    }

    let assets = await this.openSea(address, tokenId, contractAddr);
    if (!assets) {
      return false;
    }

    let table_c = 'Contract Name'.padStart(34);
    let table_i = 'Item Name'.padStart(21);
    let seperator = ''.padStart(68, '-');
    let inventory = '```\n' + table_i + table_c + '\n' + seperator + '\n';
    let iCount = 0;
    for (let i = 0; i < assets.length; i++) {
      let name = assets[i].name;
      let contract = assets[i].asset_contract.name;
      if (!name || !name == null) { continue }
      if (!contract || !contract == null) { continue }
      if (!filter) {
        if (itemName && itemName != name.toLowerCase().replace(/\s/g,'').substring(0,6)) { continue }
        if (contractName && contractName != contract.toLowerCase().replace(/\s/g,'').substring(0,6)) { continue }
      }
      inventory += ((name.length >= 34) ? (name.substring(0,31) + '...') : name.padEnd(34)) + ' | ' + ((contract.length >= 34) ? (contract.substring(0,31) + '...') : contract) + '\n'
      let testMax = inventory.length + 150;
      iCount += 1;
      if (testMax > 1900 || iCount == 10) { break }
    }
    inventory += '```';

    if (iCount < 1) { return false }
    return inventory;
  }

  async getContract(address, contractName, itemName) {
    itemName = itemName.toLowerCase().replace(/\s/g,'').substring(0,6);
    contractName = contractName.toLowerCase().replace(/\s/g,'').substring(0,6);

    let assets = await this.openSea(address);
    if (!assets) {
      return false;
    }
    for (let i = 0; i < assets.length; i++) {
      if (!assets[i].name || !assets[i].name == null) { continue }
      if (!assets[i].asset_contract.name || !assets[i].asset_contract.name == null) { continue }
      let name = assets[i].name.toLowerCase().replace(/\s/g,'').substring(0,6);
      let contract = assets[i].asset_contract.name.toLowerCase().replace(/\s/g,'').substring(0,6);
      if (itemName != name || contractName != contract) {
        continue;
      }

      /* Break Enjin */
      if (assets[i].asset_contract.name == 'Enjin' || assets[i].asset_contract.name == 'Enjin Old') { return false }
      let address = assets[i].asset_contract.address
      let id = assets[i].token_id;
      return {'address': address, 'id': id};
    }

    return false;
  }

  async getInventoryApi(address, contractName, itemName) {
    let tokenId = '';
    let contractAddr = '';

    if (!contractName || contractName.length != 42) { return false }
    if (itemName) {
      tokenId = '&token_ids=' + itemName;
    }

    contractAddr = '&asset_contract_address=' + contractName;

    let assets = await this.openSea(address, tokenId, contractAddr);
    if (!assets) {
      return false;
    }
    return true;
  }

  async openSea(address, token, contract) {
    try {
      let request_url;
      if (this.network == 'rinkeby') {
        request_url = 'https://rinkeby-api.opensea.io/api/v1/assets?owner='+ address + (token ? token : '') + (contract ? contract : '') + '&order_by=listing_date_date&order_direction=desc&limit=300';
      } else {
        request_url = 'https://api.opensea.io/api/v1/assets?owner='+ address + (token ? token : '') + (contract ? contract : '') + '&order_by=listing_date&order_direction=desc&limit=300';
      }
      let request = await axios.get(request_url, {}, { headers: { 'X-API-KEY' : cfg.OS_KEY }});
      if (!request || !request.data || !request.data.assets) { return false; }
      return request.data.assets;
    } catch (ex) {
      return false;
    }
  }
}

module.exports = OpenSea;
