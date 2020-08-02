const axios = require('axios');

let datas = [];

/* Sending ETH */
const send_1 = {
    to: 'Cr0wn',
    to_platform: 'mule',
    from: 'cr0wngh0ul.eth',
    value: '.0000001',
    network: 'rinkeby',
}
datas.push(send_1)

/* Sending Token */
const send_2 = {
    to: '410291034166132736',
    to_platform: 'discord',
    from: '515640029',
    from_platform: 'telegram',
    value: '1',
    token: 'DAI' // Or contract address
}
datas.push(send_2)

/* Sending NFT */
const send_3 = {
    to: '0xc0ffeeD1835620b81fb8d0cAD1098cE210F739e9',
    from: 'Cr0wn_Gh0ul#6666',
    from_platform: 'discord',
    network: 'rinkeby',
    token: 'https://rinkeby.opensea.io/assets/0xcab327beabb43658a78c1d25845195722d848ede/1433' // Or /contract/id
}
datas.push(send_3)

/* Sending ETH */
const send_4 = {
    to: 'Cr0wn',
    to_platform: 'mule',
    from: '0x69330F17E1f1a31CD97C4D42323A1F5978ec4D18',
    value: '.01',
    network: 'maticv3',
    store: true
}
datas.push(send_4)

test(datas)

async function test(datas) {
  for (i = 0; i < datas.length; i++) {
    let res = await tryRequest('create-tx', datas[i]);
    console.log(res.data)
    if (res.data.data && res.data.data.tx_info && res.data.data.tx_info.token) {
      console.log(res.data.data.tx_info.token)
    }
  }
}
async function tryRequest(route, data) {
    try {
        let request = await axios.post('http://127.0.0.1:5000/api/' + route, data);
        return request;
    } catch(ex) {
        console.log('Axios eror: ' + ex);
    }
}
