const express = require('express');
const router = express.Router();
const messageController = require('../Controller/messageController');
const withMongoDBConnection = require('../Middleware/middleware').withMongoDBConnection;

router.get('/messages',withMongoDBConnection, messageController.getMessages);
router.get('/message',withMongoDBConnection, messageController.getMessage);
router.post('/message',withMongoDBConnection, messageController.postMessage);
router.put('/message/:id',withMongoDBConnection, messageController.updateMessage);
router.delete('/message/:id',withMongoDBConnection, messageController.deleteMessage);
router.patch('/message/:id',withMongoDBConnection, messageController.patchMessage);

router.all('*', messageController.invalid);
module.exports = router;
