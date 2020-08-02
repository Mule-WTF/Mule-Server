const axios = require('axios');

/** API for requests from non-client services */
class Api {
  /**
   * @param {Object} cfg - confgiuration settings
   * @param {Object} logger - logger
   */
  constructor(cfg, logger) {
    this.apiUrl = cfg.API_URL ? cfg.API_URL : 'https://api.mule.wtf/';
    this.logger = logger;
  }

  /**
   * Send API request
   * @param {string} route - Route to requeted data
   * @param {Object} [data={}] - POST data for request
   */
  async request(route, data) {
    if (!route) { return false }
    if (!data) { data = {} }
    try {
      let req = await axios.post(this.apiUrl + route, data, {timeout: 5000});
      if (!req || req.status != 200) {
        if (req.response && req.response.error) {
          return req.response;
        }
        return false;
      }
      return req.data;
    } catch(ex) {
      this.logger.error('Api request failed: ' + ex);
      return false;
    }
  }
}
module.exports = Api;
