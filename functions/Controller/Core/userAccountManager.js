const jwt = require('jsonwebtoken');
const secretKey = 'lIeT5&3dcS29xI9W'; // Replace with a secure secret key

function login(payload) {
    return new Promise(async (resolve, reject) => {
        try {

            console.log('inside user acct. manager');
            let result = generateToken(payload);

            if (result) { if (result['result']) resolve(result); } else reject(result);
        }
        catch (e) {
            throw e;
        }
    });

}
const verifyToken = async (req, res, next) => {
    try {
        // Extract the token from the 'Authorization' header in the HTTP request
        const token = req.get('Authorization');
        console.log(token);
        // Check if the token is missing
        if (!token) {
            res.status(401).send({ "result": false, "error": "Unauthorized", "error": "token is missing" });
            // If the token is missing, respond with a 401 Unauthorized status and a JSON message
        }

        // If the token is present, attempt to verify it using the specified secret key
        jwt.verify(token, secretKey, async (err, decoded) => {
            // Check for errors during token verification
            if (err) {

                // If there's an error (e.g., token is invalid or expired), respond with a 401 status and a JSON message

                if (err.name === 'TokenExpiredError') {
                    if (req.session) console.log('Rtoken: ' + JSON.stringify(req.session))
                    if (req.session && req.session.token) {
                        let result = await validateRefreshToken(req.session.token.refresh_token);
                        if (!result['result']) {
                            console.log('Token expired');
                            res.status(403).send({ "result": false, "error": "Not allowed because your token got expired. please login again." });
                        }
                        else {
                            console.log('Token renovation process started.');
                            console.log('current token details: ' + req.session.token);
                            console.log('renewed the token values.');
                            req.session.token = result['data'];
                            console.log('token details from variable: ' + result['data']);
                            console.log('token details from session: ' + req.session.token);
                            console.log('Token renovation completed.');
                        }
                    }
                    else {
                        res.status(403).send({ "result": false, "error": "Not allowed because your token is invalid. pease login again." });

                    }

                    // Token is expired
                } else {
                    // Other verification errors
                    console.log('Token invalid');
                    res.status(403).send({ "result": false, "error": "Not allowed because your token is invalid. please login again." });
                }

            }

            else {
                console.log('token verified.');

                // If verification is successful, attach the decoded user information to the request object
                req.user = decoded;

                // Call the next middleware or route handler in the chain
                next();
            }
        });
    } catch (error) {
        throw error;
    }

};

const verifyTokenValue = async (req) => {
    try {
        // Extract the token from the 'Authorization' header in the HTTP request
        const token = req;
        // Check if the token is missing
        if (!token) {
            return { "result": false, "error": "Unauthorized" }
            // If the token is missing, respond with a 401 Unauthorized status and a JSON message
        }

        // If the token is present, attempt to verify it using the specified secret key
        jwt.verify(token, secretKey, (err, decoded) => {
            // Check for errors during token verification
            if (err) {
                // If there's an error (e.g., token is invalid or expired), respond with a 401 status and a JSON message
                if (err.name === 'TokenExpiredError') {
                    return { "result": false, "error": "token expired" }

                } else {

                    return { "result": false, "error": "token invalid" }
                }

            }
            console.log('token verified.');

            // If verification is successful, attach the decoded user information to the request object
            return { "result": true, "messgae": "token verfied." }
            // Call the next middleware or route handler in the chain
        });
    } catch (error) {
        return { "result": false, "error": error }
    }

};

function generateToken(payload) {
    try {
        console.log('Inside user account manager');

        const cred = {
            user: payload.user,
            role: payload.role
        };

        // Use '1h' for 1 hour and '2h' for 2 hours
        const Atoken = jwt.sign(cred, secretKey, { expiresIn: '1h' });
        const Rtoken = jwt.sign(cred, secretKey, { expiresIn: '2h' });

        console.log('Result:', { data: { access_token: Atoken, refresh_token: Rtoken }, result: true });

        return { data: { access_token: Atoken, refresh_token: Rtoken }, result: true };
    } catch (error) {
        console.error('Error generating token:', error);
        return { errorMessage: error, result: false };
    }
}



async function logout(request) {
    return new Promise(async (resolve, reject) => {
        try {
            // ... your existing code ...

            request.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    let result = { 'result': false, 'message': 'Error destroying session: ', 'error': err };
                    reject(result);
                }

                // Instead of resolve, use the resolve function and pass the result
                resolve({ 'message': 'Logged out Successful', 'result': true });
            });
        } catch (e) {
            reject(e); // Reject with the error
        }
    });
}

const validateRefreshToken = async (token) => {
    return new Promise(async (resolve, reject) => {

        try {
            // Validate the refresh token (e.g., check against a database)
            if (isValidRefreshToken(token)) {
                // If valid, extract user data from the refresh token
                const userData = extractUserDataFromRefreshToken(token);

                // Generate a new access token
                const new_token = generateToken(userData);

                // Send the new access token to the client
                resolve({ "result": true, "data": new_token });
            } else {
                // If the refresh token is not valid, return an error response
                reject({ "result": false, "error": "Invalid refresh token" });
            }
        } catch (error) {
            reject({ "result": false, "error": error })
        }

    });
}

const isValidRefreshToken = async (refreshToken) => {
    try {
        let result = await verifyTokenValue(refreshToken);

        // Your implementation to validate the refresh token
        // Example: Check against a database or an in-memory store
        // Return true if the token is valid, false otherwise
        // Add your specific logic for token validation
        // For illustration purposes, assume it's always valid
        return result['result'];
    } catch (error) {
        console.error('Error validating refresh token:', error);
        res.send(err);
    }
};

const extractUserDataFromRefreshToken = (refreshToken) => {
    try {
        // Your implementation to extract user data from the refresh token
        // Example: Decode the token to get user information
        const decodedToken = jwt.decode(refreshToken);
        console.log('decoded token: ' + decodedToken);
        // Extract relevant user data from the decoded token
        const userData = decodedToken ? decodedToken.user : null;
        return userData;
    } catch (error) {
        console.error('Error extracting user data from refresh token:', error);
        res.send(err);
    }
};


module.exports = {
    login,
    logout,
    verifyToken,
    validateRefreshToken
}