var Primus = require('primus')
  , Emitter = require('primus-emitter')
  , Socket = Primus.createSocket
    ( { transformer: 'websockets'
      , parser: 'JSON'
      , plugin: { emitter: Emitter }
      }
    )
  , handleEvents = require('./event-handler')()

module.exports = function socketClient() {

  function connect(admiralHost, callback) {
    if (!admiralHost) {
      admiralHost = 'http://none:none@127.0.0.1:8006'
    }

    var client = new Socket(admiralHost, { strategy: false })

    client.on('open', function () {
      client.send('register', null, function (response) {
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
