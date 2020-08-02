/**
 * @module Sessions
 * @category API
 */
/**
 * Sessions
 */
// Redis Client Init

const redis = require('redis');
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

// Session Mngmt
const session = require('express-session');
const Store = require('connect-redis')(session);

// Redis Error Catching
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

const redisStore = new Store({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  client: redisClient
})

const redisSession = session({
    secret: process.env.REDIS_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: redisStore
})

module.exports = {
  session : redisSession
}
