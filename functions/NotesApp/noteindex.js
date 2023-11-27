const express = require('express');
const bodyparser = require('body-parser');
const route = require('./routing');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  // Handle WebSocket connections here
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


app.use(bodyparser.json());
app.use('/', route);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
