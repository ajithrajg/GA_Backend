const middleware = require('../Controller/Core/userAccountManager');

const securityGuard = async (req, res, next) => {
  try {
    if(req.get('from-ga') && req.get('Authorization')) {
        await middleware.verifyToken(req.get('Authorization'));
    }
    else res.status(403).send("Not Allowed");
  } catch (error) {
    console.error(`Not Allowed: ${error}`);
    res.status(500).send({"message":"Internal Server Error","error": error});
  }
}

module.exports = {
    securityGuard
}