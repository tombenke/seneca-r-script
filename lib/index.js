var R = require("r-script");
const pluginName = 'seneca-r-script'

module.exports = function(options) {
    const seneca = this

    seneca.add(`init: ${pluginName}`, function(msg, respond) {
        seneca.log.info('init ' + pluginName)
        respond(null)
    })

    seneca.add(`role: ${pluginName}, cmd: call`, function(msg, respond) {
        const opts = seneca.util.deepextend({}, msg.options)
        const data = seneca.util.deepextend({}, msg.data)
        seneca.log.info(`called => role: ${pluginName}, cmd: call, path: ${msg.path}, data: ${msg.data}`)
        R(msg.path).data(data).call(opts, (error, out) => {
            if (error) {
                seneca.log.error('Error in seneca-r-script.call: ', error.toString(), out)
            }
            respond(error, out)
        });
    });

    seneca.add(`role: ${pluginName}, cmd: callSync`, function(msg, respond) {
        const opts = seneca.util.deepextend({}, msg.options)
        const data = seneca.util.deepextend({}, msg.data)
        seneca.log.info(`called => role: ${pluginName}, cmd: callSync, path: ${msg.path}, data: ${msg.data}`)
        let err = null
        try {
            var out = R(msg.path).data(data).callSync(opts);
        } catch(error) {
            err = error
            seneca.log.error('Error in seneca-r-script.callSync: ', error, out)
        }
        respond(err, out)    
    });

    return pluginName;
}
