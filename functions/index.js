const functions = require("firebase-functions");

const express = require('express');

const cors = require('cors');
const app = express();
const { onRequest } = require('firebase-functions/v2/https');
var reports = require('./CSPReportManager');
app.use(cors({ origin: true }));

// functions.AddReport = onRequest(
//   {timeoutSeconds: 3200, region: ["us-central1"]},
//   {cors: ['https://ajithrajg-resume.web.app/','https://us-central1-mydatabasename.cloudfunctions.net']},
//   (req, res) => {
//     res.status(200).send("Hello world!");
//   }
// );
app.get('/FetchCSPReports', async function (req, res) {
  try {
    var result = null;
    result = await reports.FetchCSPReports(req);
    console.log("Fetched csp reports: "+result);
    console.log('type of result '+typeof result);
    console.log(JSON.stringify(result));
    let csp = ( result != null && result['result']!=undefined ) ? result['result'] : false;
    res.status(csp?200:204).send(csp?result:"CSP Report not found");
  }
  catch(err) {
    res.send(err);
  }
});

app.post('/StoreCSPReports', async (req, res) => {
  try {
    var result = null;
    result = await reports.StoreCSPReport(req.query);
    console.log("stored csp reports: "+result);
    console.log('type of result '+typeof result);
    let csp = ( result !=null && result['result'] ) ? result['result'] : false;
    res.status(csp?200:503).send(csp?result:"Error occurred while updating");
  }
  catch(err) {
    res.send(err);
  }
});

app.post('/ReadCSPReports', async (req, res) => {
  try {
    var result = null;
    result = await reports.ReadCspReports();
    console.log("Read csp reports: "+result);
    console.log('type of result '+typeof result);
    let csp = ( result !=null && result['result'] ) ? result['result'] : false;
    res.status(csp?200:503).send(csp?result:"Error occurred while updating");
  }
  catch(err) {
    res.send(err);
  }
});

app.post('/AddCSPReports', async (req, res) => {
  try {
    var result = null;
    result = await reports.AddCspReports(req.query);
    console.log("stored csp reports: "+result);
    console.log('type of result '+typeof result);
    let csp = ( result !=null && result['result'] ) ? result['result'] : false;
    res.status(csp?200:503).send(csp?result:"Error occurred while updating");
  }
  catch(err) {
    res.send(err);
  }
});

var token = require('./tokenManager');

app.post('/NewCustomToken', (req, res) => {
  try {
    console.log(req!=null?req.query!=null?req.query.Authorization?req.query.Authorization:"Authorization not found":"query itself not found":"res itself not found");
    var result = null;
    result = token.FetchCustomToken(req);
    console.log("Fetched token: "+result);
    let isToken = ( result && result.result ) ? result.result : false;
    res.status(isToken?200:401).send(isToken?result:"Please check whether you sent the auth token in the request header");
  }
  catch(err) {
    res.send(err);
  }
});

exports.app = functions.https.onRequest(app);