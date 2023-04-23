const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const models = require("../models");
const {errorHandler, withTransaction} = require('../util');
const {HttpError} = require("../error");
const logger = require("../logger");

const access = errorHandler(async (req, res, next) => {
    return res.status(200).json({ message: 'Success' });
})

const register = errorHandler(withTransaction(async (req, res, session) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const userDoc = models.User({
        email: req.body.email,
        password: hash,
        bio: req.body.bio,
    });
    const refreshTokenDoc = models.RefreshToken({
        owner: userDoc.id
    })

    await userDoc.save({session});
    await refreshTokenDoc.save({session});

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    return res.json({
        message: 'Register successful',
        id: userDoc.id,
        refreshToken
    });
}));

const login = errorHandler(withTransaction(async (req, res, session) => {
    const userDoc = await models.User
        .findOne({email: req.body.email})
        .select('+password')
        .exec();
    if (!userDoc) throw new HttpError(401, 'Incorrect Email or Password');
    await verifyPassword(userDoc.password, req.body.password);

    const refreshTokenDoc = models.RefreshToken({ owner: userDoc.id });

    await refreshTokenDoc.save({session});

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    const csrfToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const accessToken = createAccessToken(userDoc.id, csrfToken);

    res.cookie('csrfToken', csrfToken, { httpOnly: true, maxAge: 604800000 });
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 600000 });

    res.status(200).send({
        message: 'Login successful',
        id: userDoc.id,
        refreshToken
    });
}));

const newRefreshToken = errorHandler(withTransaction(async (req, res, session) => {
    const currentRefreshToken = await validateRefreshToken(req.body.refreshToken);
    const refreshTokenDoc = models.RefreshToken({
        owner: currentRefreshToken.userId
    });

    await refreshTokenDoc.save({session});
    await models.RefreshToken.deleteOne(
        {_id: currentRefreshToken.tokenId},
        {session}
    );

    const refreshToken = createRefreshToken(currentRefreshToken.userId, refreshTokenDoc.id);
    const accessToken = createAccessToken(currentRefreshToken.userId);

    return {
        id: currentRefreshToken.userId,
        accessToken,
        refreshToken
    };
}));

const newAccessToken = errorHandler(async (req, res) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    const accessToken = createAccessToken(refreshToken.userId);

    return {
        id: refreshToken.userId,
        accessToken,
        refreshToken: req.body.refreshToken
    }
});

const logout = errorHandler(withTransaction(async (req, res, session) => {
    const token = req.body.refreshToken;
    if (!token) throw new HttpError(401, "No refresh token");
    logger.info("Token: " + token);
    const refreshToken = await validateRefreshToken(token);
    logger.info("Refresh Token: " + refreshToken);
    await models.RefreshToken.deleteOne(
        {_id: refreshToken.tokenId},
        {session}
    );
    res.cookie('csrfToken', '', { httpOnly: true, maxAge: 0 });
    res.cookie('accessToken', '', { httpOnly: true, maxAge: 0 });

    res.status(200).send({
        message: 'Logout successful',
    });
}));

const logoutAll = errorHandler(withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await models.RefreshToken.deleteMany(
        {owner: refreshToken.userId},
        {session}
    );
    return {success: true};
}));

function createAccessToken(userId, csrfToken) {
    return jwt.sign({
        userId: userId,
        csrf: csrfToken
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10m'
    });
}

function createRefreshToken(userId, refreshTokenId) {
    return jwt.sign({
        userId: userId,
        tokenId: refreshTokenId
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d'
    });
}

const verifyPassword = async (hashedPassword, rawPassword) => {
    const auth = await bcrypt.compare(rawPassword, hashedPassword);
    if (auth) {
        //
    } else {
        throw new HttpError(401, "Invalid email or password");
    }
};

const validateRefreshToken = async (token) => {
    const decodeToken = () => {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (e) {
            throw new HttpError(401, 'Unauthorized');
        }
    }

    const decodedToken = decodeToken();
    const tokenExists = await models.RefreshToken.exists({
        _id: decodedToken.tokenId
    });

    if (tokenExists) {
        return decodedToken;
    }
    return new HttpError(401, 'Unauthorised');
}

module.exports = {
    register,
    login,
    access,
    newRefreshToken,
    newAccessToken,
    logout
}