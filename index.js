require('dotenv').config();

const restify = require('restify');
const rjwt = require('restify-jwt-community');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

global.package = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')).toString());

require('./nms').start();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err) => {
    if (err) console.log(`MongoDB connection error ${err}`);
});

const server = restify.createServer();
const io = require('socket.io').listen(server.server);
require('./handlers/chat')(io);

server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.fullResponse());
server.use(rjwt({ secret: process.env.JWT_SECRET }).unless({
    path: [
        { url: '/', methods: ['GET'] },
        { url: '/user', methods: ['POST'] },
        { url: /^\/user\/token\/.*/, methods: ['GET'] }, /* /user/token/:username */
        { url: '/user/authenticate', methods: ['POST'] }
    ]
}));

fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => 
    require(path.join(__dirname, 'routes', file))(server)
);

server.listen(PORT, function(){
    console.log(`Listening ${package.name} v${package.version} on port ${PORT}`);
});
