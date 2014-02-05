#!/usr/bin/env node
var serviceLocator = require('service-locator').createServiceLocator()
  , app = require('commander')
  , levelup = require('levelup')
  , fs = require('fs')
  , socketClient = require('./lib/socket-client')()
  , requestSender = require('./lib/request-sender')()
  , db = levelup(process.env.HOME + '/.navy-comms-config')

serviceLocator.register('db', db)

var configManager = require('./lib/config-manager')(serviceLocator)

serviceLocator.register('config', configManager)
serviceLocator.register('socketClient', socketClient)
serviceLocator.register('requestSender', requestSender)

app.unknownOption = function (arg) {
  console.log('')
  console.log('  Unknown option "' + arg + '"')
  app.help()
  process.exit(0)
}

app
  .version('0.0.1')
  .option('-a, --admiral [http://127.0.0.1:8006]', 'admiral host to connect to')

fs.readdir('./commands/', function (error, files) {

  // process once so loaded commands have access to options
  app.parse(process.argv)

  files.forEach(function (file) {
    require('./commands/' + file)(serviceLocator, app)
  })

  // process again so that our null argument check works
  app.parse(process.argv)

  if (typeof app.args[app.args.length - 1] !== 'object') {
    app.help()
  }

})
