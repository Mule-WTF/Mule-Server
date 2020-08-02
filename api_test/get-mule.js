const axios = require('axios');

async function test() {
  let req = await tryRequest('get-mule/Cr0wn')
  console.log(req.data)
  console.log(req.data.data.linked)
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
