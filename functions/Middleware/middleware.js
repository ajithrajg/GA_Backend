// middleware.js
const run = require('../Database/db');

async function withMongoDBConnection(req, res, next) {
    console.log('creating db instance');
  const { client, collection } = await run("ChatSpace", "ChatMessage");
  console.log('created db instance');

  try {
    req.mongoClient = client;
    req.mongoCollection = collection;
    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    console.error(`Something went wrong with the MongoDB connection: ${err}`);
    res.status(500).send("Internal Server Error");
  } finally {
    // Attach an event listener to close the connection when the response is finished
    res.on('finish', () => {
      if (req.mongoClient) {
        req.mongoClient.close();
      }
    });
  }
}

const { promisify } = require('util');
const { lookup } = require('dns');
const { resolve } = require('path');

const dnsLookup = promisify(lookup);

const loadBalancerMiddleware = async (req, res, next) => {
  try {
    // Assuming your application has multiple backend servers
    const backendServers = ['https://server1.example.com', 'https://server2.example.com', 'https://server3.example.com'];

    // Perform DNS lookup to get IP addresses of backend servers
    const backendIPs = await Promise.all(backendServers.map(server => dnsLookup(new URL(server).hostname)));

    // Simulate a basic load balancing algorithm (e.g., round-robin)
    const selectedServerIP = backendIPs[Math.floor(Math.random() * backendIPs.length)];

    // Set the selected backend server in a custom header
    res.setHeader('X-Selected-Backend-Server', selectedServerIP);

    // Log the selected server for monitoring purposes
    console.log(`Request to ${req.url} routed to ${selectedServerIP}`);

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // Handle DNS lookup errors or other issues
    console.error('Error during load balancing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { withMongoDBConnection, loadBalancerMiddleware }
