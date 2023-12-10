const middleware = require('../Controller/Core/userAccountManager');
let tokenBlacklist = require('../Controller/AuthController').tokenBlacklist;


const securityGuard = async (req, res, next) => {
  try {
    if (req.get('from-ga') && req.get('Authorization')) {
      await middleware.verifyToken(req, res, next);
    }
    else res.status(403).send("Not Allowed");
  } catch (error) {
    console.error(`Not Allowed: ${error.message}`);
    res.send(error);
    // if (error.message === 'Unauthorized') {
    //   res.status(401).send({ "Status": "401", "Error": error.message });
    // } else {
    //   // Handle other errors with a generic 500 Internal Server Error response
    //   res.status(403).send({ "Status": "403", "Error": error.message });
    // }
  }
}

const checkBlackListed = async (req, res, next) => {
  try {
    if (req.get('from-ga') && req.get('Authorization')) {
      const token = req.get('Authorization');
      // Check if the token is in the blacklist
      if ((token && tokenBlacklist.includes(token))) {
        console.log('token blacklisted!');
        res.status(403).send("Token revoked or expired, please login again.");
      }
      console.log('next...');
      next();
    }
    else res.status(403).send("Not Allowed");
  } catch (error) {
    res.send(error);
  }
}

const verifyFresher = async (req, res, next) => {
  try {

    console.log('checking from-ga...');
    if (req.get('from-ga')) {
      verifyFreshers(req, res, next);

      console.log('verified payload. -> next()');
      next();
    }
    else res.status(403).send("Not Allowed");
  } catch (error) {
    console.error(`Not Allowed: ${error}`);
    res.status(500).send({ "message": "Internal Server Error", "error": error });
  }
}

const verifyFreshers = (req, res) => {
  try {
    let result = typeof req.body !== 'object' ? JSON.parse(req.body) : req.body;
    if (!result || !result.user || !result.role) res.status(403).send('Not Allowed');
  }
  catch (error) {
    console.error(`Not Allowed: ${error}`);
    res.status(500).send({ "message": "Internal Server Error", "error": error });
  }
}

module.exports = {
  securityGuard,
  verifyFresher,
  checkBlackListed
}