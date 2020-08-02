const pool      = require('./db.js');
const bot       = require('./Queries/botQueries.js');
const token     = require('./Queries/tokenQueries.js');
const web       = require('./Queries/webQueries.js');
const api       = require('./Queries/apiQueries.js');

/** Postgresql */
class SqlController {
  /**
   * Create PSQL controller
   * @param {Object} cfg - Configuration Settings
   * @param {Object} logger - Logger
   */
  constructor(cfg, logger) {
    this.cfg = cfg;
    this.logger = logger
    this.client;
  }

  /**
   * Connect to the database
   */
  async connect() {
    if (this.client) { return true; }
    try {
      let db = await pool(this.cfg);
      this.client = await db.connect();
      return true;
    } catch(ex) {
      this.logger.error(ex);
      return false;
    }
  }

  /**
   * Create database query
   * @param {string} type - Query type
   * @param {string} name - Name of the query within the type
   * @param {string} values - Values to be used in the query
   */
  async query(type, name, values) {
    if (!type || !name || !values) {
      return false;
    }
    let result;
    try {
      let connect = await this.connect();
      if (!connect) {
        throw "Couldn't connect to the database!";
      }
      let sql = await this.queryType(type);
      if (!sql) {
        throw "Could not get query type!"
      }
      let q = sql[name](...values);
      result = await this.client.query(q);
      if (result.rowCount < 1) {
        return false;
      }
    } catch(ex) {
      this.logger.error(ex);
      if (this.client) { await this.close(); }
      return false;
    }
    await this.close();
    return result;
  }

  /**
   * Close connection to database
   */
  async close() {
    if (this.client) {
      try {
        await this.client.release();
        this.client = false;
      } catch(ex) {
        this.logger.warn(ex);
        return;
      }
    }
    return;
  }

  /**
   * Get all queries for specified type
   */
  async queryType(type) {
    let queries;
    switch(type) {
      case 'bot':
        queries = bot;
        break;
      case 'token':
        queries = token;
        break;
      case 'web':
        queries = web;
        break;
      case 'api':
        queries = api;
        break;
      default:
        queries = false;
        break;
    }
    return queries;
  }

}
module.exports = SqlController;
