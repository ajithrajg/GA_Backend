var entitlement = require('./Core/entitlements');
var feedbacks = require('./Core/feedback');


const entitlements = async (req, res) => {

    try {
        var result = null;
        result = await entitlement.getProducts(req.body, admin);
        let csp = ( result !=null && result['result'] ) ? result['result'] : false;
        res.status(csp?200:503).send(csp?result:"Error occurred while updating");
    }
    catch(err) {
      res.send(err);
    }

}

const feedback = async (req, res) => {

    try {
      var result = null;
      result = await feedbacks.writeWebFeedback(req.body, admin);
      let feedback_result = ( result != null && result['result'] ) ? result['result'] : false;
      res.status(feedback_result?200:503).send(feedback_result?result:"Error occurred while submitting your feedback");
    }
    catch(err) {
      res.send(err);
    }

}

module.exports = {
    entitlements,
    feedback
}