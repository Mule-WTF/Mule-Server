const pg = require('pg');
async function getPool(cfg) {
  const pool = new pg.Pool({
    host:     cfg.SQL_HOST,
    user:     cfg.SQL_USER,
    password: cfg.SQL_PASSWD,
    port:     cfg.SQL_PORT || 5432,
    database: cfg.SQL_DB,
    max:      cfg.SQL_LIMIT
  });
  return pool;
}

/**
 * DB Pool
 */
module.exports = getPool;
