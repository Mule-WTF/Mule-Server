const axios = require('axios');

async function test() {
  let data = {
    name: 'YaBoi',
    supply: '420000',
    network: 'kovan',
    from: '0x69330F17E1f1a31CD97C4D42323A1F5978ec4D18'
  }

  let req = await tryRequest('create-token', data)
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

test()
