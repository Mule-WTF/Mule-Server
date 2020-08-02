const axios = require('axios');

async function test() {
  let data = {
    user: 'Cr0wn_Gh0ul#6666',
    platform: 'discord'
  }

  let req = await tryRequest('address-user', data);
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
