const schema = require('../schemas');
const live = require('../handlers/live');

module.exports = function(server) {

    server.post(
        '/live',
        schema.validate,
        live.new
    );

    server.get(
        '/live/:id',
        live.get
    );

}
