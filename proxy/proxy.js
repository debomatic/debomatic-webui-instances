var http = require('http')
  , httpProxy = require('http-proxy')

var subdomains = {}

subdomains["debomatic-amd64.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8064
  }
})

subdomains["debomatic-i386.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8032
  }
})

var mainServer = http.createServer(function(req, res) {
  var host = req.headers.host
  if (subdomains.hasOwnProperty(host))
    subdomains[host].web(req, res)
})

// tunneling websockets
mainServer.on('upgrade', function (req, socket, head) {
  var host = req.headers.host
  if (subdomains.hasOwnProperty(host))
    subdomains[host].ws(req, socket, head);
});

mainServer.listen(80)