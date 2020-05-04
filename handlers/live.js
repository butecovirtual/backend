const errors = require('restify-errors');
const msg = require('../messages');
const Live = require('../models/Live');
const User = require('../models/User');

module.exports.new = async (req, res, next) => {
    new Live(Object.assign(req.params, { artist: req.user.uid })).save((err, live) => {
        if (err)
            return next(new errors.InternalServerError(msg.ERR_UNKNOWN));

        res.send({ id: live._id });
        return next();
    });
}

var _liveToReturn = (live) => {
    live.viewers.map((v) => { return { id: v._id, username: v.username }});
    return {
        id: live._id,
        title: live.title,
        artist: {
            id: live.artist._id,
            username: live.artist.username,
            mobile: live.artist.mobile,
            artist: live.artist.artist || { }
        },
        when: live.when,
        status: live.status,
        valueBase: live.valueBase,
        valueTable: live.valueTable,
        sponsors: live.sponsors,
        viewers: live.viewers || []
    }
}

module.exports.get = async (req, res, next) => {
    var live = await Live.findById(req.params.id).populate('artist');
    if (!live)
        return next(new errors.NotFoundError(msg.LIVE_NOT_FOUND));

    res.send(_liveToReturn(live));
    return next();
}

module.exports.all = async (req, res, next) => {
    var where = {
        when: {$gte: new Date().toISOString().split('T')[0]}
    };
    if (req.params.artist) where.artist = req.params.artist;
    if (req.params.status) where.status = req.params.status;

    var lives = await Live.find(where)
        .populate('artist')
        .populate('viewers', '_id username')
        .sort('-createdAt');
        
    res.send(lives.map((l) => _liveToReturn(l)));
    return next();
}
