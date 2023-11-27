var user = require('./Core/userAccountManager');
const utils = require('../Utils/utils');

const login = async (req, res) => {

    try {
      const id = utils.generateGUID(req);
      req.session.user = id;
      var result = null;
      result = await user.login(req.body);
      let account = ( result != null && result['result'] ) ? result['result'] : false;
      res.status(account?200:503).send(account?result:"Error occurred while submitting your feedback");
    }
    catch(err) {
      res.send(err);
    }
  
}

const logout = async (req, res) => {

    try {
      var result = null;
      result = await user.logout(req.body);
      let account = ( result != null && result['result'] ) ? result['result'] : false;
      res.status(account?200:503).send(account?result:"Error occurred while submitting your feedback");
    }
    catch(err) {
      res.send(err);
    }
  
}

module.exports = {
    login,
    logout
}