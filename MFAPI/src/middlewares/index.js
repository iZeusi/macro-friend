const {HttpError} = require('../error');
const {errorHandler} = require('../util');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

const validateRequest = errorHandler((req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const csrfToken = req.cookies.csrfToken;

    if (!accessToken) throw new HttpError(401, 'Unauthorized');
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decodedToken.userId;

    if (!csrfToken) throw new HttpError(401, 'Unauthorized');
    if (decodedToken.csrf !== csrfToken) throw new HttpError(401, 'Unauthorized');
    next();
});

module.exports = {
    validateRequest
}