var http = require('http')
  , https = require('https')
  , httpProxy = require('http-proxy')
  , fs = require('fs')

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

subdomains["debomatic-arm64.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8001
  }
})

subdomains["debomatic-armel.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8002
  }
})

subdomains["debomatic-armhf.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8003
  }
})

subdomains["debomatic-mips64el.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8004
  }
})

subdomains["debomatic-ppc64el.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8008
  }
})

subdomains["debomatic-riscv64.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8005
  }
})

subdomains["debomatic-s390x.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8009
  }
})

subdomains["debomatic-staging.debian.net"] = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8099
  }
})

if (fs.existsSync('/etc/letsencrypt/live/debomatic-amd64.debian.net')) {
  var options = {
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/debomatic-amd64.debian.net/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/debomatic-amd64.debian.net/cert.pem')
    }
  }
}

if (fs.existsSync('/etc/letsencrypt/live/debomatic-arm64.debian.net')) {
  var options = {
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/debomatic-arm64.debian.net/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/debomatic-arm64.debian.net/cert.pem')
    }
  }
}

if (fs.existsSync('/etc/letsencrypt/live/debomatic-staging.debian.net')) {
  var options = {
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/debomatic-staging.debian.net/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/debomatic-staging.debian.net/cert.pem')
    }
  }
}

var mainServer = https.createServer(options.https, function(req, res) {
  var host = req.headers.host
  if (subdomains.hasOwnProperty(host))
    subdomains[host].web(req, res)
})

// tunneling websockets
mainServer.on('upgrade', function (req, socket, head) {
  var host = req.headers.host
  if (subdomains.hasOwnProperty(host))
    subdomains[host].ws(req, socket, head)
})

const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` })
  res.end()
})

mainServer.listen(443)
httpServer.listen(80)
