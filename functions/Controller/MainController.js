var entitlement = require('./Core/entitlements');
var feedbacks = require('./Core/feedback');

const admin = require("firebase-admin");

const entitlements = async (req, res) => {

  try {
    if (req.get('from-ga') && req.get('Authorization') && req.session.token) {
      var result = null;
      result = await entitlement.getEntitlements(req.body, admin);
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

const feedback = async (req, res) => {

  try {
    if (req.get('from-ga') && req.get('Authorization') && req.session.token) {
      var result = null;
      result = await feedbacks.writeWebFeedback(req.body, admin);
      let feedback_result = (result != null && result['result']) ? result['result'] : false;
      res.status(feedback_result ? 200 : 503).send(feedback_result ? result : "Error occurred while submitting your feedback");
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
  entitlements,
  feedback
}