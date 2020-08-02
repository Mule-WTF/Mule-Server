const redis       = require('redis');
const uuidv4      = require('uuid/v4');
const {promisify} = require('util');

/** Redis */
class RedisController {
  /**
   * Create Redis controller
   * @param {Object} cfg - Configuration settings
   * @param {Object} logger - Logger
   */
  constructor(cfg, logger) {
    this.keystore = redis.createClient({
        host: cfg.REDIS_HOST || 'localhost',
        port: cfg.REDIS_PORT || 6379
    });
    this.logger = logger;
  }

  /**
   * Get Value from Redis
   * @param {string} key - Key to get data by
   */
  async get(key) {
    try {
      let getKey = promisify(this.keystore.get).bind(this.keystore);
      let value = await getKey(key);
      return value;
    } catch(ex) {
      this.logger.error(ex);
      return false;
    }
  }

  /**
   * Store value in Redis
   * @param {string} val - Value to store
   * @param {string} [key=UUID] - Key to store value by
   * @param {string} [exp=900] - Time to live before expiration
   */
  async store(val, key, exp) {
    try {
      if (!key) { key = uuidv4() }
      if (!exp) { exp = 900}
      this.keystore.set(key, val, 'EX', exp);
    } catch(ex) {
      this.logger.error(ex);
      return false;
    }
    return key;
  }

  /**
   * Delete Entry
   * @param {string} key - Key value of the entry to be deleted
   */
  async del(key) {
    try {
      this.keystore.del(key);
      return true;
    } catch(ex) {
      return false;
    }
  }
}
module.exports = RedisController;
