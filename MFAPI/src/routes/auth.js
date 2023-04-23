const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const middlewares = require('../middlewares');

router.get('/access', middlewares.validateRequest, controllers.auth.access);
router.post('/register', express.urlencoded({ extended: false }), controllers.auth.register);
router.post('/login', express.urlencoded({ extended: false }), controllers.auth.login);
router.post('/refreshToken', express.urlencoded({ extended: false }), controllers.auth.newRefreshToken);
router.post('/accessToken', express.urlencoded({ extended: false }), controllers.auth.newAccessToken);
router.post('/logout', middlewares.validateRequest, express.urlencoded({ extended: false }), controllers.auth.logout);

module.exports = router;
