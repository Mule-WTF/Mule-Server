const axios = require('axios');

async function test() {
  let data = {
        target: '0x69330f17e1f1a31cd97c4d42323a1f5978ec4d18',
        of: 'DAI'
    }

  let req = await tryRequest('get-balance', data)
  console.log(req.data)
  console.log(req.data.data)
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
