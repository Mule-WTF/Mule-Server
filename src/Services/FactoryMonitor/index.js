const MuleController    = require('../../Classes/MuleController/MuleController.js');
const mule = new MuleController('Web3 Monitor');
const cfg = mule.cfg;

/**
 * @module Monitor
 * @category Factory Monitor
 */
async function monitor() {
  await mule.web3.addWebsocketAdapters();
  let abi = mule.web3.factory.getABI();
/*
  let mainnetWSS = mule.web3.wss.mainnet;
  let mainnetFactory = new mainnetWSS.eth.Contract(abi, cfg.MAINNET_MULE_FACTORY);
  let mainnetMonitor = new Monitor(mainnetFactory);
*/
  //mainnetMonitor(mainnetFactory)

  let rinkebyWSS = mule.web3.wss.rinkeby;
  let rinkebyFactory = new rinkebyWSS.eth.Contract(abi, cfg.RINKEBY_MULE_FACTORY);
  let rinkebyMonitor = new Monitor('rinkeby', rinkebyFactory);

	/*
  let kovanWSS = mule.web3.wss.kovan;
  let kovanFactory = new kovanWSS.eth.Contract(abi, cfg.KOVAN_MULE_FACTORY);
  let kovanMonitor = new Monitor('kovan', kovanFactory);
	*/

	/*
  let maticWSS = mule.web3.wss.matic;
  let maticFactory = new maticWSS.eth.Contract(abi, cfg.MATIC_MULE_FACTORY);
  let maticMonitor = new Monitor('matic', maticFactory);
*/
/*
  let maticMumbaiWSS = mule.web3.wss.matic-mumbai;
  let maticMumbaiFactory = new maticMumbaiWSS.eth.Contract(abi, cfg.MATIC_MUMBAI_MULE_FACTORY);
  let maticMumbaiMonitor = new Monitor('matic-mumbai', maticMumbaiFactory);
*/
}

/**
 * @class MonitorAdapter
 * @category Factory Monitor
 */
class Monitor {
  /**
   * @param {string} network - Network monitor is on
   * @param {Object} factory - Web3 Provider with factory contract
   */
  constructor(network, factory) {
    this.network = network;
    this.start(factory);
  }

  /**
   * Start monitor
   * @param {Object} factory - Web3 Provider with factory contract
   */
  start(factory) {
    let network = this.network
    console.log(network + ' Monitor Started!')
    factory.events.TokenAdded()
    .on('data', async function(event) {
      if (event.event == 'TokenAdded') {
        let newContract = event.returnValues['contract_address'];
        let tokenName = event.returnValues['token_name'];
        let totalSupply = event.returnValues['total_supply'];
        try {
          let addToken = await mule.sql.query('token', 'addToken', [tokenName, tokenName, newContract, network]);
        } catch (ex) {
          mule.logger.error('Could not add new token to database!');
        }
      }
    })
    .on('error', function(error) {
      mule.logger.error('Web3 Monitor Error!');
    });
  }
}

monitor();
