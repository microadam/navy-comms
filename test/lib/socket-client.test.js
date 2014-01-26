var sinon = require('sinon')
  , rewire = require('rewire')
  , should = require('should')
  , EventEmitter = require('events').EventEmitter
  , createSocketClient = rewire('../../lib/socket-client')

function Socket() {
  EventEmitter.call(this)
}

Socket.prototype = Object.create(EventEmitter.prototype)

describe('socket-client', function () {

  describe('connect()', function () {

    var socketStub = null
      , handleEvents = null
      , requestSender = null
      , socketClient = null

    beforeEach(function () {
      socketStub = sinon.stub()
      socketStub.returns(new Socket())
      handleEvents = sinon.spy()
      requestSender =
      { sendRegisterRequest: function (client, callback) {
          callback({})
        }
      }
      /* jshint camelcase: false */
      createSocketClient.__set__
      ( { Socket: socketStub
        , requestSender: requestSender
        , handleEvents: handleEvents
        }
      )
      socketClient = createSocketClient()
    })

    it('should send register request and handle events on server connection', function () {

      var client = socketClient.connect(false, onConnect)

      function onConnect(error, client) {
        should.exist(client)
        handleEvents.calledOnce.should.equal(true)
      }

      client.emit('open')
    })

    it('should callback with error when socket error occurs', function () {
      var client = socketClient.connect(false, onConnect)

      function onConnect(error) {
        should.exist(error)
      }

      client.emit('error', {})
    })

    it('should use default admiral connection details if none provided', function () {
      socketClient.connect(false)
      socketStub.calledWith('http://127.0.0.1:8006').should.equal(true)
    })

    it('should use provided admiral connection details', function () {
      socketClient.connect('http://127.0.0.1:8001')
      socketStub.calledWith('http://127.0.0.1:8001').should.equal(true)
    })

  })

})
