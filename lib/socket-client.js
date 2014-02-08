var Primus = require('primus')
  , Emitter = require('primus-emitter')
  , Socket = Primus.createSocket
    ( { transformer: 'websockets'
      , parser: 'JSON'
      , plugin: { emitter: Emitter }
      }
    )
  , requestSender = require('./request-sender')()
  , handleEvents = require('./event-handler')()

module.exports = function socketClient() {

  function connect(admiralHost, callback) {
    if (!admiralHost) {
      admiralHost = 'http://127.0.0.1:8006'
    }

    var client = new Socket(admiralHost, { strategy: false })

    client.on('open', function () {
      requestSender.sendRegisterRequest(client, function (response) {
        handleEvents(client)
        callback(null, client, response.clientId)
      })
    })

    client.on('error', function (error) {
      callback(error)
    })

    return client
  }

  return {
    connect: connect
  }
}
