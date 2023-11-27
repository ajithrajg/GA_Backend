const jwt = require('jsonwebtoken');
const secretKey = 'lIeT5&3dcS29xI9W'; // Replace with a secure secret key

function login(payload) {
    try {
        return new Promise(async (resolve, reject) => {

            let result = generateToken(payload);

            if (result) { if (reports['result']) resolve(reports); } else reject(reports);

        });
    }
    catch (e) {
        throw e;
    }
}
const verifyToken = async (req, res, next) => {
    // Extract the token from the 'Authorization' header in the HTTP request
    const token = req.headers.authorization;
  
    // Check if the token is missing
    if (!token) {
      // If the token is missing, respond with a 401 Unauthorized status and a JSON message
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // If the token is present, attempt to verify it using the specified secret key
    jwt.verify(token, secretKey, (err, decoded) => {
      // Check for errors during token verification
      if (err) {
        
        // If there's an error (e.g., token is invalid or expired), respond with a 401 status and a JSON message

        if (err.name === 'TokenExpiredError') {
            // Token is expired
            
            return res.status(401).json({ message: 'Token expired' });
        } else {
            // Other verification errors
            return res.status(401).json({ message: 'Token invalid' });
        }

      }
  
      // If verification is successful, attach the decoded user information to the request object
      req.user = decoded;
  
      // Call the next middleware or route handler in the chain
      next();
    });
  };
  
function generateToken(payload) {
    try {
        const cred = {
            user: payload.user,
            role: payload.role
        };

        const Atoken = jwt.sign(cred, secretKey, { expiresIn: '1h' });

        const Rtoken = jwt.sign(cred, secretKey, { expiresIn: '2h' });

        
        return { 'data': {'access_token': Atoken,'Refresh_token': Rtoken }, 'result': true };
    } catch (error) {
        return { 'errorMessage': error, 'result': false }
    }

}

function logout(request) {
    try {
        return new Promise(async (resolve, reject) => {

            //let result = await firebaseread(admin);
            request.session.destroy((err) => {
                if (err) {
                  console.error('Error destroying session:', err);
                  let result = {'result':false,'message':'Error destroying session: ','error':err};
                  reject(result);
                }

                let result = {'result':'Logout Successful'}
                resolve(result);
            });
        });
    }
    catch (e) {
        throw e;
    }
}

module.exports = { login, logout, verifyToken }