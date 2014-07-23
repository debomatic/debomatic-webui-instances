###
This is a simple function to get common config just
start from architecture and port
###

merger_config = (architecture, port) ->
    # common config
    config = {}
    config.host = 'localhost'
    config.port = port

    config.web = {}
    config.web.description = 'This is a web interface for debomatic over ' + architecture

    config.web.debomatic = {}
    config.web.debomatic.admin = {}
    config.web.debomatic.admin.email = "dktrkranz AT debian DOT org" # please use this SPAMFREE form - it will be converted client side by javascript
    config.web.debomatic.architecture = architecture

    config.debomatic = {}
    config.debomatic.path = '/srv/debomatic-' + architecture
    config.debomatic.jsonfile = '/var/log/debomatic-' + architecture + '.json'

    config.web.debomatic.dput = {}
    config.web.debomatic.dput.incoming = config.debomatic.path
    config.web.debomatic.dput.host = "debomatic-" + architecture + ".debian.net"

    return config

module.exports = merger_config
