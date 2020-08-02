const axios = require('axios');


async function test() {
  const send_4 = {
    to: 'Cr0wn',
    to_platform: 'mule',
    from: '0x69330F17E1f1a31CD97C4D42323A1F5978ec4D18',
    value: '.01',
    network: 'maticv3',
    store: true
  }

  let req_1 = await tryRequest('create-tx', send_4);
  console.log(req_1.data.data.store)

  let req_2 = await tryRequest('get-tx/' + req_1.data.data.store.key);
  console.log(req_2.data)
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
