var chalk = require('chalk')
  , moment = require('moment')

module.exports = function eventHandler() {

  function handleEvents(client) {

    client.on('serverMessage', function (data) {
      output(chalk.green.bold('Admiral: ') + chalk.cyan(data.message))
    })

    client.on('captainMessage', function (data) {
      output(chalk.blue.bold(data.captainName + ': ') + chalk.cyan(data.message))
    })

  }

  function output(message) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(chalk.magenta(now + ' - ') + message)
  }

  return handleEvents

}
