const pg = require('pg');
const fs = require('fs');
const tokensDirectory = './token_list/src/tokens/eth';
const Git = require("nodegit");
const rimraf = require("rimraf");
const dotenv = require('dotenv');
dotenv.config()

const pool = new pg.Pool({
    host:     process.env.SQL_HOST,
    user:     process.env.SQL_USER,
    password: process.env.SQL_PASSWD,
    port:     5432,
    database: process.env.SQL_DB,
});

async function update() {
    try {
    console.log('Git Cloning Repo');
    await Git.Clone('https://github.com/MyEtherWallet/ethereum-lists.git','./token_list');
  } catch(ex) {
    console.log(ex)
    console.log('Error Getting Repo!');
    process.exit();
    return
  }
  console.log('Git Repo Updated!')

  let tokenList;
  try {
    tokenList = await fs.readdirSync(tokensDirectory)
  } catch(ex){
    await cleanUp();
    console.log('Could not get token list!');
  }

  let client = await pool.connect();
  console.log('Looking for new tokens.');

  for await (currentToken of tokenList) {
    let tokenInfo = await fs.readFileSync(tokensDirectory + '/' + currentToken, 'utf-8');
    tokenInfo = JSON.parse(tokenInfo)
    let address = tokenInfo['address'] ? tokenInfo['address'] : false
    let name = tokenInfo['name'] ? tokenInfo['name'] : false
    let symbol = tokenInfo['symbol'] ? tokenInfo['symbol'] : false
    let network = 'mainnet';
    if (!address || !name || !symbol) { continue }

    let token = await client.query({text: `SELECT * FROM tokens WHERE address = $1 OR name = $2 OR symbol = $3;`, values:[address, name, symbol]});
    if (!token || token.rowCount > 1) { continue }
    try {
      let addToken = await client.query({text: `INSERT INTO tokens (name, symbol, address, network, user_added) VALUES ($1, $2, $3, $4, $5);`, values: [name, symbol, address, network, 'f']});
      console.log('Added token: ' + name);
    } catch(ex) {
      console.log(ex)
      console.log('Error adding ' + currentToken);
    }
  }

  await cleanUp();
  console.log('Completed!');
  client.release()
  process.exit();
}

async function cleanUp() {
    try {
      console.log('Removing old files');
      await rimraf.sync('./token_list');
    } catch(ex) {
      console.log('Failed to remove repo');
    }
}

update();
