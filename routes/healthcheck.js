const moment = require('moment-timezone');

module.exports = function(server) {
    server.get(
        '/', 
        (req, res, next) => {
            let duration = moment.duration(process.uptime(), 'seconds');
            
            res.send(200, {
                name: package.name,
                version: package.version,
                uptime: {
                    days: duration.days(),
                    hours: duration.hours(),
                    minutes: duration.minutes(),
                    seconds: duration.seconds()
                }
            });

            return next();
        }
    );
}
