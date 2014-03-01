var serviceLocator = require('service-locator').createServiceLocator()
  , app = require('commander')
  , levelup = require('levelup')
  , socketClient = require('./lib/socket-client')()
  , db = levelup(process.env.HOME + '/.navy-comms-config')
  , configManager = require('./lib/config-manager')(serviceLocator)
  , admiralConnector = require('./lib/admiral-connector')(serviceLocator)

serviceLocator.register('db', db)
serviceLocator.register('app', app)
serviceLocator.register('config', configManager)
serviceLocator.register('connectToAdmiral', admiralConnector)
serviceLocator.register('socketClient', socketClient)

module.exports = function bootstrap(callback) {
  callback(serviceLocator)
}
