var reports = require('./Core/CSPReportManager');

const ReadCSPReports = async (req, res, next) => {
  
    try {
      var result = null;
      result = await reports.ReadCspReports(admin);
      console.log("Read csp reports: "+result);
      console.log('type of result '+typeof result);
      let csp = ( result !=null && result['result'] ) ? result['result'] : false;
      res.status(csp?200:503).send(csp?result:"Error occurred while updating");
    }
    catch(err) {
      res.send(err);
    }

}

const AddCSPReport = async (req, res) => {

    try {
      var result = null;
        result = await reports.AddCspReport(req.body, admin);
        let csp = ( result !=null && result['result'] ) ? result['result'] : false;
        res.status(csp?200:503).send(csp?result:"Error occurred while updating");
    }
    catch(err) {
      res.send(err);
    }
  
}

const UpdateCSPReport = async (req, res) => {

    try {
      var result = null;
        result = await reports.UpdateCspReport(req.body);
        let csp = ( result !=null && result['result'] ) ? result['result'] : false;
        res.status(csp?200:503).send(csp?result:"Error occurred while updating");
    }
    catch(err) {
      res.send(err);
    }
  
}

const DeleteCSPReport = async (req, res) => {

    try {
      var result = null;
        result = await reports.DeleteCspReport(req.body);
        let csp = ( result !=null && result['result'] ) ? result['result'] : false;
        res.status(csp?200:503).send(csp?result:"Error occurred while updating");
    }
    catch(err) {
      res.send(err);
    }
  
}

module.exports = {
    ReadCSPReports,
    AddCSPReport,
    UpdateCSPReport,
    DeleteCSPReport
}