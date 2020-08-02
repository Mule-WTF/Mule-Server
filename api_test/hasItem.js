const axios = require('axios');

async function test() {
  let data = {
    user: '410291034166132736',
    platform: 'discord',
    network: 'rinkeby',
    contract: '0xcab327beabb43658a78c1d25845195722d848ede',
    token_id: '1124'
  }

  let req = await tryRequest('has-item', data)
  console.log(req.data)
}

async function tryRequest(route, data) {
    try {
        let request = axios.post('http://127.0.0.1:5000/api/' + route, data);
        return request;
    } catch(ex) {
        console.log('Axios eror: ' + ex);
    }
}

test();
