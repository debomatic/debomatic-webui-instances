
/*
 * debomatic-webui i386 configuration
 */

var architecture = 'i386'
var port = 8032


// common config
var config = {}
config.host = 'localhost'
config.port = port

config.web = {}
config.web.debomatic = {}
config.web.debomatic.admin = {}
config.web.debomatic.admin.email = "dktrkranz AT debian DOT org" // please use this SPAMFREE form - it will be converted client side by javascript
config.web.debomatic.architecture = architecture

config.debomatic = {}
config.debomatic.path = '/srv/debomatic-' + architecture

config.web.debomatic.dput = {}
config.web.debomatic.dput.incoming = config.debomatic.path
config.web.debomatic.dput.host = "debomatic-" + architecture + ".debian.net"

// DO NOT EDIT THIS LINE:
module.exports = config
