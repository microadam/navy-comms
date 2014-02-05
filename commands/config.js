var showUsage = require('../util/usage')

module.exports = function (serviceLocator, app) {

  app
    .command('config')
    .description('change the comms default configuration')
    .action(function (subcommand, key, value) {
      if (typeof key === 'object') key = null
      if (typeof value === 'object') value = null

      switch (subcommand) {
      case 'set':
        set(key, value)
        break;
      case 'get':
        get(key)
        break;
      default:
        displayUsage()
      }
    })

  function set(key, value) {
    if (key && value) {
      serviceLocator.config.set(key, value)
    } else {
      displayUsage()
    }
  }

  function get(key) {
    if (key) {
      serviceLocator.config.get(key, function (value) {
        console.log(key + ': ' + value)
      })
    } else {
      displayUsage()
    }
  }

  function displayUsage() {
    var usage =
    [ [ 'get <variable>', 'view the current value of a config variable' ]
    , [ 'set <variable>', 'change the value of a config variable' ]
    ]
    showUsage('config', usage)
  }

}
