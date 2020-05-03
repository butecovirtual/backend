const errors = require('restify-errors');
const random = require('randomstring');
const jwt = require('jsonwebtoken');
const sms = require('../handlers/sms');
const User = require('../models/User');
const AccessToken = require('../models/AccessToken');
const msg = require('../messages');

const ACCESS_TOKEN_SIZE = 4;

var _generateAccessToken = (req, res, next, user) => {
    let token = random.generate({
        length: ACCESS_TOKEN_SIZE,
        charset: 'numeric'
    });
    let rdnmstr = random.generate({ length: 15 });

    new AccessToken({
        user: user._id,
        token: token
    }).save((err) => {
        if (err)
            return next(new errors.InternalServerError(msg.ERR_UNKNOWN));

        sms.send(user.mobile, `Use ${token} como seu código de segurança do Buteco Virtual <${rdnmstr}>`);
        res.send(200);
        return next();
    });
}

module.exports.register = async (req, res, next) => {
    if (await User.findByUsername(req.params.username))
        return next(new errors.ConflictError(msg.USERNAME_ALREADY_TAKEN));

    new User({
        username: req.params.username,
        mobile: req.params.mobile
    }).save((err, user) => {
        if (err)
            return next(new errors.InternalServerError(msg.ERR_UNKNOWN));

        _generateAccessToken(req, res, next, user);
    });
}

module.exports.get = async (req, res, next) => {
    var user = await User.findById(req.user.uid);
    if (!user)
        return next(new errors.NotFoundError(msg.USERNAME_NOT_FOUND));

    res.send({
        id: user._id,
        username: user.username,
        mobile: user.mobile,
        artist: user.artist
    });
    return next();
}

module.exports.token = async (req, res, next) => {
    console.log(`/user/token/${req.params.username}`);
    var user = await User.findByUsername(req.params.username);
    if (!user)
        return next(new errors.NotFoundError(msg.USERNAME_NOT_FOUND));

    _generateAccessToken(req, res, next, user);
}

module.exports.authenticate = async (req, res, next) => {
    var accessToken = await AccessToken.findByUsersToken(req.params.username, req.params.token);
    if (!accessToken || !accessToken.user)
        return next(new errors.NotAuthorizedError(msg.ACCESS_DENIED));

    jwt.sign({ uid: accessToken.user._id }, process.env.JWT_SECRET, { expiresIn: '36500 days' }, (err, token) => {
        if (err)
            return next(new errors.InternalServerError(msg.ERR_UNKNOWN));

        let { iat, exp } = jwt.decode(token);
        res.send({
            iat: iat,
            exp: exp,
            token: token
        });
        return next();
    });
}

module.exports.artist = async (req, res, next) => {
    User.findByIdAndUpdate(req.user.uid, { artist: req.params }, (err) => {
        if (err)
            return next(new errors.InternalServerError(msg.ERR_UNKNOWN));

        res.send(200);
        return next();
    });
}
