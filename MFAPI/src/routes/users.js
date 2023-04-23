const express = require('express');
const controllers = require('../controllers');
const middlewares = require("../middlewares");
const router = express.Router();

router.get('/me', middlewares.validateRequest, controllers.users.me);

module.exports = router;