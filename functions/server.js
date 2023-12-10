// Your Express server code
const functions = require('firebase-functions');
const sessioncredentials = functions.config().ga.sessioncredentials;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./Router/mainRoute');
const errorHandler = require('./ErrorHandler/errorHandler');
const allowedOrigins = ['https://ajithraj-g.web.app', 'https://ga-csp.web.app', 
'https://ga-chatspace.web.app', 'https://ga-cdn.web.app'];
// const allowedLocalOrigins = ['http://localhost:4200', 'http://localhost:3000'];
const session = require('express-session'); 

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(bodyParser.json());
//app.use(middlewares.securityGuard);

app.use(
  session({
    secret: sessioncredentials,
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/', router);
app.use(errorHandler);

exports.app = functions.https.onRequest(app);
