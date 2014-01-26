var chalk = require('chalk')

module.exports = function eventHandler() {

  function handleEvents(client) {

    client.on('serverMessage', function (data) {
      console.log(chalk.green.bold('Admiral: ') + chalk.cyan(data.message))
    })

    client.on('captainMessage', function (data) {
      console.log(chalk.blue.bold(data.captainName + ': ') + chalk.cyan(data.message))
    })

  }

  return handleEvents

}
