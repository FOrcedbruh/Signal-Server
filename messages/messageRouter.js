const express = require('express');
const controller = require('./messageController');
const protectRoute = require('./../middleware/protectRoute');

const messageRouter = express.Router();

messageRouter.post('/send/:id', protectRoute, controller.sendMessage);
messageRouter.get('/:id', protectRoute, controller.getMessage);
messageRouter.post('/delete', protectRoute, controller.deleteMessage);



module.exports = messageRouter;