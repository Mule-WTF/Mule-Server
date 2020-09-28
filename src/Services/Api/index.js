/**
 * API Server
 * @module API SERVER
 * @category API
 */

/* Express Server */
const cluster       = require('cluster')
const os            = require('os')
const express       = require('express');
const cors 	        = require('cors')
const bodyParser    = require('body-parser');
const session       = require('express-session')
const RedisStore    = require('connect-redis')(session)
const RateLimit     = require("express-rate-limit");
const LimiterStore  = require('rate-limit-redis');
const cfg           = require('../../Config/webConfig.js');
const api           = require('./Handler/apiHandler.js');
const portal        = require('./Handler/portalHandler.js');
const resp          = require('./Utils/response.js');

const isPrime = require('./primetest.js');

/* Mule Controller */
const MuleController    = require('../../Classes/MuleController/MuleController.js');
const mule = new MuleController('web');
const muleMiddleware = function(req, res, next) {
    res.locals.mule = mule;
    res.locals.resp = resp;
    next();
}

/* Limiter */
const limiter = new RateLimit({
  store: new LimiterStore({
    client: mule.redis.keystore
  }),
  max: 30,
  windowMs: 1 * 60 * 1000,
  message: 'Oops, you request too much, try again later!'
});

const accountLimiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // start blocking after 5 requests
  message:
    "Too many requests, please try again in 15 minutes."
});

/* CORS */
const whitelist = ['https://www.lab.mule.wtf', 'https://lab.mule.wtf', 'https://www.lab-api.mule.wtf', 'https://lab-api.mule.wtf', 'https://www.mule.wtf', 'https://mule.wtf', 'https://www.api.mule.wtf', 'https://api.mule.wtf']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
  methods: ['POST', 'OPTIONS', 'GET'],
  maxAge: 200
}

if (cluster.isMaster && cfg.PRODUCTION == 1) {
  const cpuCount = os.cpus().length
  for (let i = 0; i < cpuCount - 1; i++) {
    cluster.fork()
  }
} else {
  const server = express();

    server.get('/test', (req, res) => {
        const primes = []
        const max = Number(req.query.max) || 1000
        for (let i = 1; i <= max; i++) {
            if (isPrime(i)) primes.push(i)
        }
        res.json(primes)
    })

  if (cfg.PRODUCTION && cfg.PRODUCTION != 0) {
    server.options('*', cors(corsOptions))
    server.use(cors(corsOptions));
  }

  /* Express Middleware */
  server.set('trust proxy', 1)
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));

  /* Public Api */
  for (let endpoint in api) {
    if (api.hasOwnProperty(endpoint)) {
      server.post('/' + endpoint, limiter);
      server.post('/' + endpoint, [muleMiddleware, api[endpoint]]);
    }
  }

  /* Sessions */
  server.use(session({
      store: new RedisStore({ client: mule.redis.keystore }),
      secret: cfg.SESSION_SECRET,
      cookie: cfg.PRODUCTION == 0 ? {} : {domain: '.mule.wtf', secure: true, httpOnly: true},
      resave: false,
      saveUninitialized: false
    })
  );

  /* limit register and login */
  server.post('/register', accountLimiter);
  server.post('/login', accountLimiter);

  /* Mule Client portal */
  for (let endpoint in portal) {
    if (portal.hasOwnProperty(endpoint)) {
      server.post('/' + endpoint, [muleMiddleware, portal[endpoint]]);
    }
  }

  /* Start Server */
  server.listen(cfg.PORT, () => console.log(`Api Ready! Port: ${cfg.PORT}!`));
}

cluster.on('exit', (worker) => {
    console.log('WORKER ', worker.id, ' FAILED!')
    cluster.fork()
});
