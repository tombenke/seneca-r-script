const expect = require('chai').expect
const seneca = require('seneca')({ log: { level: 'warn+' } })
const plugin = require('./index')
const pluginName = "seneca-r-script"

before(function(done) {
    this.seneca = seneca
        .use(plugin)
        .ready(function() {
            done()
        })
})

after(function() {
    seneca.act('role:seneca,cmd:close')
})

describe(`${pluginName}`, function() {

    it('callSync echo', function(done) {
        const dataToSend = { text: 'some text...', num: 12345, logic: true }
        const optionsToSend = { pretty: true }
        seneca.act(`role: ${pluginName}, cmd: callSync, path: ./lib/echo.spec.R`, { data: dataToSend, options: optionsToSend }, function(err, data) {
            if (err === null) {
                expect(data[0]).to.eql(dataToSend)
                done(err)
            }
        })
    })
    
    it('call echo', function(done) {
        const dataToSend = { text: 'some text...', num: 12345, logic: true }
        seneca.act(`role: ${pluginName}, cmd: call, path: ./lib/echo.spec.R`, { data: dataToSend }, function(err, data) {
            if (err === null) {
                expect(data[0]).to.eql(dataToSend)
                done(err)
            }
        })
    })
    
    it('failed call', function(done) {
        const dataToFail = { text: 'some text...', num: 12345, pleaseFail: true }
        seneca.act(`role: ${pluginName}, cmd: call, path: ./lib/fail.spec.R`, { data: dataToFail }, function(err, data) {
            if (err === null) {
                expect(data[0]).to.equal(false)
                done(err)
            }
        })
    })
})
