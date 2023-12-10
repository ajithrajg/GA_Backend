var user = require('./Core/userAccountManager');
let tokenBlacklist = [];

const login = async (req, res) => {

  try {
    if (req.get('from-ga')) {
      console.log('generate id for user');
      const id = await generateGUID(req, res);
      req.session.user = id;
      var result = null;
      console.log('inside auth controller');
      result = await user.login(req.body);
      req.session.token = result.data;

      let account = (result != null && result['result']) ? result['result'] : false;
      res.status(account ? 200 : 503).send(account ? result : "Error occurred while submitting your feedback");
    }
    else {
      res.status(403).send("Not Allowed");
    }

  }
  catch (err) {
    res.send(err);
  }

}



const refreshToken = async (req, res) => {
  try {

    const refreshToken = req.body.refreshToken;

    let result = await user.validateRefreshToken(refreshToken);
  }
  catch (error) {
    res.send(err);
  }
}

const generateGUID = async (req, res) => {
  try {
    // Generate a random part
    var randomPart = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    // Add timestamp randomness
    var timestampPart = Math.floor(Date.now()).toString(16);

    // Concatenate random and timestamp parts
    return randomPart + timestampPart + req.get('from-ga');
  }
  catch (error) {
    res.send(err);
  }
}

// AuthController.logout implementation
const logout = async (req, res) => {
  try {
    if (req.get('from-ga') && req.get('Authorization') && req.session.token) {
      // Assuming user.logout returns a promise
      const result = await user.logout(req);
      // Handle the result of the logout operation
      //res.headers.Authorization = undefined;
      const tokenToRevoke = req.get('Authorization');

      // Add the token to the blacklist
      tokenBlacklist.push(tokenToRevoke);
      
      const account = (result != null && result['result']) ? result['result'] : false;
      res.status(account ? 200 : 503).send(account ? result : "Error occurred while logging out");
    }
    else {
      res.status(403).send("Not Allowed");
    }

  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  login,
  logout,
  tokenBlacklist
}