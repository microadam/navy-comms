var async = require('async')

module.exports = function createAdmiralConnector(serviceLocator) {

  function connect(admiralHost, callback) {
    var finalAdmiralHost = admiralHost
    async.waterfall
    ( [ function (waterCallback) {
          determineAdmiralHost(admiralHost, function (error, storedAdmiralHost) {
            finalAdmiralHost = storedAdmiralHost
            waterCallback(error, finalAdmiralHost)
          })
        }
      , serviceLocator.socketClient.connect
      ]
    , function (error, client, clientId) {
        if (error) {
          console.error('Unable to connect to Admiral at: ' + finalAdmiralHost + '. Error: ' + error.message)
        } else {
          callback(client, clientId)
        }
      }
    )
  }

  function determineAdmiralHost(admiralHost, callback) {
    serviceLocator.config.get('admiral', function (value) {
      if (!admiralHost && value && typeof value !== 'object') {
        admiralHost = value
      }
      callback(null, admiralHost)
    })
  }

  return connect

}
