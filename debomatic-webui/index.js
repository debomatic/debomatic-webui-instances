
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./lib/config.js')
  , utils = require('./lib/utils.js')
  , http = require('http')
  , app = module.exports = express()
  , Client = require('./lib/client.js')
  , Broadcaster = require('./lib/broadcaster.js')


// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(config.routes.debomatic, express.directory(config.debomatic.path));
  app.use(config.routes.debomatic, express.static(config.debomatic.path));
  //app.enable('trust proxy');
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get(config.routes.distribution, routes.distribution)
if (config.routes.preferences)
  app.get(config.routes.preferences, routes.preferences)

var server = http.createServer(app)
  , io = require('socket.io').listen(server, config.socket)

// Listening
server.listen(config.port, config.host, null, function(err){

  // Checking nodejs with sudo:
  // Find out which user used sudo through the environment variable
  // and set his user id
  var uid = parseInt(process.env.SUDO_UID);
  if (uid) {
    console.log("Please do not run nodejs with sudo. Changing user to %d", uid)
    process.setgid(uid);
    process.setuid(uid);
  }

  // statuses
  var status = {}
  status.packages = []

  var broadcast = new Broadcaster(io.sockets, status)

  io.sockets.on('connection', function(socket) {
    var client = new Client(socket)
    client.start()
    if (status.packages.length > 0)
      client.send_status(status)
  });

  console.log("Debomatic-webui listening on %s:%d in %s mode", server.address().address, server.address().port, app.settings.env);
});

server.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('Address in use %s:%d. Exit.', config.host, config.port);
    process.exit(1);
  }
  else {
    console.error(e);
  }
});
