// Services/firebaseService.js

const admin = require("firebase-admin");
const serviceAccount = require("../mydatabasename-firebase-adminsdk-e0p6w-d3b20d26bf.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mydatabasename-default-rtdb.firebaseio.com"
});

module.exports = admin;
