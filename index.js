const restify = require('restify');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

global.package = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')).toString());

const server = restify.createServer({
    name: package.name,
    version: package.version
});

server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.fullResponse());

fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => 
    require(path.join(__dirname, 'routes', file))(server)
);

server.listen(PORT, function(){
    console.log(`Listening ${package.name} v${package.version} on port ${PORT}`);
});
