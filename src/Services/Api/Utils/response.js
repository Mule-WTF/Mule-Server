/**
 * @module response
 * @category API
 * @subcategory Utils
 */
/**
 * response
 * @param {Object} req - express req
 * @param {Object} res - express res
 * @param {string} status - status code of response
 * @param {Object} message - response message
 * @param {Object} data - data being returned
 */
module.exports = (req,res,status,message,data) => {
    let payload = {
        'data'      : data ? data : {},
        'response'  : message ? message : {},
        'status'    : status ? status : 500,
        'success'   : (status === 200) ? true : false
    }
    res.send(payload);
    return res.end();
}

