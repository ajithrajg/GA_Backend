// Your Express server code
const functions = require('firebase-functions');
const sessioncredentials = functions.config();
console.log(sessioncredentials);
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./Router/mainRoute');
const middlewares = require('./Middleware/manInTheMiddle');
const errorHandler = require('./ErrorHandler/errorHandler');
const allowedOrigins = ['https://ajithrajg-web.app', 'https://ga-csp.web.app', 'https://ga-chatspace.web.app'];
const session = require('express-session'); // Add this line for session support

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
    secret: "sessioncredentials", // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/', router);
app.use(errorHandler);

exports.app = functions.https.onRequest(app);
// ...

// Assuming you've set up Firebase Hosting, you would deploy the static content
// generated by your Express application, which includes the API endpoint.
