var sinon = require('sinon')
  , rewire = require('rewire')
  , EventEmitter = require('events').EventEmitter
  , createHandleEvents = rewire('../../lib/event-handler')

function Client() {
  EventEmitter.call(this)
}

Client.prototype = Object.create(EventEmitter.prototype)

describe('event-handler', function () {

  describe('handleEvents()', function () {

    var handleEvents = false
      , logSpy = false

    beforeEach(function () {
      logSpy = sinon.spy()
      /* jshint camelcase: false */
      createHandleEvents.__set__({ console: { log: logSpy } })
      handleEvents = createHandleEvents()
    })

    it('should listen to the serverMessage event', function () {
      var client = new Client()
      handleEvents(client)
      client.emit('serverMessage', { message: 'hello' })
      var output = '\u001b[1m\u001b[32mAdmiral: \u001b[39m\u001b[22m\u001b[36mhello\u001b[39m'
      logSpy.calledWith(output).should.equal(true)
    })

    it('should listen to the captainMessage event', function () {
      var client = new Client()
      handleEvents(client)
      client.emit('captainMessage', { captainName: 'test', message: 'hello' })
      var output = '\u001b[1m\u001b[34mtest: \u001b[39m\u001b[22m\u001b[36mhello\u001b[39m'
      logSpy.calledWith(output).should.equal(true)
    })

  })

})
