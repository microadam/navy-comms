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
      logSpy.calledOnce.should.equal(true)
    })

    it('should listen to the captainMessage event', function () {
      var client = new Client()
      handleEvents(client)
      client.emit('captainMessage', { captainName: 'test', message: 'hello' })
      logSpy.calledOnce.should.equal(true)
    })

  })

})
