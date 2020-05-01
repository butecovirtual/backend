const errors = require('restify-errors');
const msg = require('../messages');
const Live = require('../models/Live');

module.exports.new = async (req, res, next) => {
    new Live(Object.assign(req.params, { artist: req.user.uid })).save((err, live) => {
        if (err)
            return next(new errors.InternalServerError(msg.ERR_UNKNOWN));

        res.send({ id: live._id });
        return next();
    });
}

module.exports.get = async (req, res, next) => {
    var live = await Live.findById(req.params.id).populate('artist');
    if (!live)
        return next(new errors.NotFoundError(msg.LIVE_NOT_FOUND));

    res.send({
        title: live.title,
        artist: {
            id: live.artist._id,
            username: live.artist.username,
            mobile: live.artist.mobile
        },
        when: live.when,
        status: live.status,
        valueBase: live.valueBase,
        valueTable: live.valueTable,
        sponsors: live.sponsors
    });
    return next();
}
