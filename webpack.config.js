const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node', // Required to bundle for Node.js environment
  entry: './functions/server.js', // Replace with the path to your Express server file
  output: {
    path: path.resolve(__dirname, 'public\\gaauthservices\\dist'),
    filename: 'gaauthservices.js',
  },
  externals: [nodeExternals()], // Exclude Node.js modules from the bundle
};
