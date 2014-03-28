#!/usr/bin/env node
var bootstrap = require('./bootstrap')
  , fs = require('fs')

bootstrap(function (serviceLocator) {
  serviceLocator.app.unknownOption = function (arg) {
    console.log('')
    console.log('  Unknown option "' + arg + '"')
    serviceLocator.app.help()
    process.exit(0)
  }

  serviceLocator.app
    .version(require('./package.json').version)
    .option('-a, --admiral [http://127.0.0.1:8006]', 'admiral host to connect to')

  fs.readdir(__dirname + '/commands/', function (error, files) {

    // process once so loaded commands have access to options
    serviceLocator.app.parse(process.argv)

    files.forEach(function (file) {
      require('./commands/' + file)(serviceLocator)
    })

    // process again so that our null argument check works
    serviceLocator.app.parse(process.argv)

    if (typeof serviceLocator.app.args[serviceLocator.app.args.length - 1] !== 'object') {
      serviceLocator.app.help()
    }

  })
})
