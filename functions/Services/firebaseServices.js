// Services/firebaseService.js

const admin = require("firebase-admin");
const serviceAccount = require("../myfirebase-admin-secret.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mydatabasename-default-rtdb.firebaseio.com"
});

module.exports = admin;
