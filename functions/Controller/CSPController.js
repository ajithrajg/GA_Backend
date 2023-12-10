var reports = require('./Core/CSPReportManager');
const admin = require("firebase-admin");
const serviceAccount = require("../mydatabasename-firebase-adminsdk-e0p6w-d3b20d26bf.json");
const functions = require('firebase-functions');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().ga.firebasedb
});

const ReadCSPReports = async (req, res, next) => {
  try {
    //if (req.get('from-ga') && req.get('Authorization') && req.session.token) {

      var result = null;
      result = await reports.ReadCspReports(admin);

      let csp = (result != null && result['result']) ? result['result'] : false;
      res.status(csp ? 200 : 503).send(csp ? result : "Error occurred while updating");
    // }

    // else {
    //   res.status(403).send("Not Allowed");
    // }
  } catch (err) {
    // Handle the promise rejection
    console.error("Error in ReadCSPReports:", err);

    // Check if the error is a result object from the rejected promise
    if (err && err['result'] === false) {
      res.status(503).send(err); // Send the rejection result
    } else {
      res.status(500).send("Internal Server Error"); // Default error response
    }
  }
};


const AddCSPReport = async (req, res) => {

  try {
    //if (req.get('from-ga') && req.get('Authorization') && req.session.token) {

      var result = null;
      result = await reports.AddCspReport(req.body, admin);
      let csp = (result != null && result['result']) ? result['result'] : false;
      res.status(csp ? 200 : 503).send(csp ? result : "Error occurred while updating.");
    // }

    // else {
    //   res.status(403).send("Not Allowed");
    // }
  }
  catch (err) {
    res.send(err);
  }

}

const UpdateCSPReport = async (req, res) => {

  try {
    //if (req.get('from-ga') && req.get('Authorization') && req.session.token) {

      var result = null;
      result = await reports.UpdateCspReport(req.body);
      let csp = (result != null && result['result']) ? result['result'] : false;
      res.status(csp ? 200 : 503).send(csp ? result : "Error occurred while updating");
    // }

    // else {
    //   res.status(403).send("Not Allowed");
    // }
  }
  catch (err) {
    res.send(err);
  }

}

const DeleteCSPReport = async (req, res) => {

  try {
    if (req.get('from-ga') && req.get('Authorization') && req.session.token) {

      var result = null;
      result = await reports.DeleteCspReport(req.body);
      let csp = (result != null && result['result']) ? result['result'] : false;
      res.status(csp ? 200 : 503).send(csp ? result : "Error occurred while updating");
    }

    else {
      res.status(403).send("Not Allowed");
    }
  }
  catch (err) {
    res.send(err);
  }

}

module.exports = {
  ReadCSPReports,
  AddCSPReport,
  UpdateCSPReport,
  DeleteCSPReport
}