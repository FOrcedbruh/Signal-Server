const express = require('express');
const controller = require('./usersController');
const protectRoute = require('./../middleware/protectRoute');

const usersRouter = express.Router();

usersRouter.get('/', protectRoute, controller.getUsersForSideBar);


module.exports = usersRouter;