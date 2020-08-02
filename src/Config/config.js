const dotenv = require('dotenv');
dotenv.config();

let REDIS_PORT   = process.env.REDIS_PORT;
let REDIS_HOST   = process.env.REDIS_HOST;
let SQL_HOST     = process.env.SQL_HOST;
let SQL_USER     = process.env.SQL_USER;
let SQL_PASSWD   = process.env.SQL_PASSWD;
let SQL_PORT     = process.env.SQL_PORT || 5433;
let SQL_DB       = process.env.SQL_DB;
let SQL_LIMIT    = process.env.SQL_LIMIT;
let OS_KEY       = process.env.OS_KEY;
let API_URL      = process.env.API_URL;

let MAINNET_MULE_FACTORY = process.env.MAINNET_MULE_FACTORY;
let RINKEBY_MULE_FACTORY = process.env.RINKEBY_MULE_FACTORY;
let MATIC_MULE_FACTORY = process.env.MATIC_MULE_FACTORY;
let MATIC_MUMBAI_MULE_FACTORY = process.env.MATIC_MUMBAI_MULE_FACTORY;
let KOVAN_MULE_FACTORY = process.env.KOVAN_MULE_FACTORY;

let INFURA_ID = process.env.INFURA_ID;

/** Master config */
module.exports = {
  REDIS_PORT,
  REDIS_HOST,
  SQL_HOST,
  SQL_USER,
  SQL_PASSWD,
  SQL_PORT,
  SQL_DB,
  SQL_LIMIT,
  OS_KEY,
  API_URL,
  MAINNET_MULE_FACTORY,
  RINKEBY_MULE_FACTORY,
  KOVAN_MULE_FACTORY,
  MATIC_MULE_FACTORY,
  MATIC_MUMBAI_MULE_FACTORY,
  INFURA_ID
}

