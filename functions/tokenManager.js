const http = require('http');

let getRandomInt= function() {
    return Math.floor(Math.random() * 10);
}

function VerifyUserSession(x) {
    const userAgent = x.headers['user-agent'];

    const isFromBrowser = /firefox|chrome|mozilla|safari|opera|msie/i.test(userAgent);
    
    const isCapchaResultAvailable = CheckCapchaResult(x);
    const isSecretOk = checkClientSecret(x);
    if (isFromBrowser && isCapchaResultAvailable && isSecretOk) {
        const options = {
            hostname: 'https://',
            port: 3000,
            path: '/',
            method: 'POST',
          };
          
          const req = http.request(options, (res) => {
            let data = '';
          
            res.on('data', (chunk) => {
              data += chunk;
            });
          
            res.on('end', () => {
              console.log('Response from server:', data);
            });
          });
          
          req.on('error', (error) => {
            console.error('Error:', error.message);
          });
          
          req.end();
    } else {
      console.log('Request did not come from a browser');
    }
}

function CheckCapchaResult(x) {
    console.log(x);
    return true;
}

function checkClientSecret(x) {
    console.log(x);
    return true;
}
function FetchCustomToken(req) {
  return new Promise((resolve, reject) => {
    if(req.query) {
      if(req.query.Authorization) {
        let check = ValidateAuthExp(req.query.ExpDate);
        if(check == true) {
          result = setNewToken();
          console.log("verified request token.");
          resolve({"data":result,"result":true});
        }
        else reject({"data":'Token is going to be expired!',"result":false});
      }
      else {
        reject({"data":"UnAuthorized","result":false});
      }
    }
  });
}

let ValidateAuthExp = function(x) {
    var result = false;
    try {
      var Currentdate = new Date();
      result = x.getTime() - Currentdate.getTime();
    }
    catch(ex) {
      return ex;
    }
    return result > 30 ? true : result <= 0 ? false : {"Error":"Fresh Token Required","Message": "Your request token is almost expired.  Please send us the request again with fresh token"};
}

let setNewToken = function() {
    try {
        let access_token = '';
        for(let i=0;i<10;i++) {
            const randomInt = getRandomInt();
            
            //console.log("random integer: "+ randomInt);
            access_token += randomInt ? makeid(randomInt) : null;
            
            //console.log("access token: "+access_token);
        }

        const date = new Date();
        date.setDate(date.getDate()+1);
        let tokenObj = {
            "access_token": access_token ? encryptData(access_token) : null,
            "expDate": date,
            "result": false
        }

        if(tokenObj) {
            if(tokenObj.access_token && tokenObj.access_token != null) tokenObj.result=true;
        }
        
        console.log("token "+tokenObj.access_token +" expiry date: "+tokenObj.expDate);
        return Promise.resolve(tokenObj);
    }
    catch(ex) {
        console.log(ex);
    }
}

let encryptData = function(token) {
    try {
        var CryptoJS = require("crypto-js");

        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(token, 'newToken').toString();
        
        // Decrypt
        //var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        //var originalText = bytes.toString(CryptoJS.enc.Utf8);
        
        //console.log(originalText); // 'my message'
        return ciphertext;
    }
    catch(ex) {
        console.log(ex);
    }
}

let makeid = function(length) {
    try {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    catch(ex) {
        console.log(ex);
    }
}

module.exports = { FetchCustomToken }