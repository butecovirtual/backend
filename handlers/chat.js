const _ = require('lodash');
const Live = require('../models/Live');
const User = require('../models/User');

var viewers = [];

module.exports = (io) => {
    io.sockets.on('connection', function (socket) {
        var connectedUserId;

        var _viewersInLive = (id) => {
            return io.sockets.adapter.rooms[id] && io.sockets.adapter.rooms[id].length || 0;
        }
    
        var _addViewerToLive = (userId, liveId) => {
            Live.findById(liveId, (err, live) => {
                if (!live.viewers) live.viewers = [];
                if (!live.viewers.includes(userId)){
                    live.viewers.push(userId);
                    live.save();
                }
            });
    
            viewers.push({
                liveId: liveId,
                userId: userId
            });
            console.log(`live-viewers ${_viewersInLive(liveId)}`);
            io.sockets.in(liveId).emit('live-viewers', _viewersInLive(liveId));
        }
    
        var _delUserFromLive = async (userId, liveId) => {
            const user = await User.findById(userId);
            io.sockets.in(liveId).emit('live-leave', {
                user: {
                    id: user._id,
                    username: user.username
                }
            });
            console.log(`live-viewers ${_viewersInLive(liveId)}`);
            io.sockets.in(liveId).emit('live-viewers', _viewersInLive(liveId));
        }

        socket.on('disconnect', () => {
            var i = -1;
            while ((i = viewers.map(v => v.userId).indexOf(connectedUserId)) >= 0)
                _delUserFromLive(connectedUserId, viewers.splice(i, 1)[0].liveId);
        });

        socket.on('live-start', ({ liveId }) => {
            Live.findByIdAndUpdate(liveId, { status: 'Ao Vivo' }, (err) => {
                if (err) console.log(`live-start err ${err}`);
            });
        });

        socket.on('live-end', ({ liveId }) => {
            Live.findByIdAndUpdate(liveId, { status: 'Encerrada' }, (err) => {
                if (err) console.log(`live-end err ${err}`);

                socket.broadcast.to(liveId).emit('live-end');
            });
        });

        socket.on('live-join', async ({ liveId, userId }) => {
            console.log(`live-join liveId: ${liveId} | ${userId}`);

            connectedUserId = userId;

            socket.join(liveId);
            _addViewerToLive(userId, liveId);

            var user = await User.findById(userId);
            if (!user) return;  /* discard the message */

            socket.broadcast.to(liveId).emit('live-join', { 
                user: { 
                    id: user._id, 
                    username: user.username 
                } 
            });
        });

        socket.on('live-leave', ({ liveId, userId }) => {
            console.log(`live-leave liveId: ${liveId} | ${userId}`);

            var i = -1;
            if ((i = _.findIndex(viewers, {liveId, userId})) >= 0)
                _delUserFromLive(connectedUserId, viewers.splice(i, 1)[0].liveId);
        });

        socket.on('message', async ({ liveId, userId, message }) => {
            var user = await User.findById(userId);
            if (!user) return;  /* discard the message */

            socket.broadcast.to(liveId).emit('message', {
                user: {
                    id: user._id,
                    username: user.username
                },
                message
            });
        });

        socket.on('react', async ({ liveId, userId, reaction }) => {
            var user = await User.findById(userId);
            if (!user) return;  /* discard the message */

            socket.broadcast.to(liveId).emit('react', {
                user: {
                    id: user._id,
                    username: user.username
                },
                reaction
            });
        });
    });

}
