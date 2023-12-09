const MongoClient = require("mongodb").MongoClient;
const functions = require('firebase-functions');

const dbConnectionString = functions.config().ga.db;


// Use username and password in your code

async function run(dbname, tblname) {
  // TODO:
  // Replace the placeholder connection string below with your
  // Altas cluster specifics. Be sure it includes
  // a valid username and password! Note that in a production environment,
  // you do not want to store your password in plain-text here.
  console.log('db: '+dbname+' table: '+tblname);
  
  const uri = dbConnectionString;
  console.log('starting connection...');
  // The MongoClient is the object that references the connection to our
  // datastore (Atlas, for example)
  const client = new MongoClient(uri);

  // The connect() method does not attempt a connection; instead it instructs
  // the driver to connect using the settings provided when a connection
  // is required.
    try {
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Error connecting to MongoDB: ", err);
    }

  const dbName = dbname;
  const collectionName = tblname;
  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  
  // Export the database and collection
  return {
    client,
    collection
  };
  
}


module.exports = {run};