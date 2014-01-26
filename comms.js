#!/usr/bin/env node
var app = require('commander')
  , _ = require('lodash')
  , socketClient = require('./lib/socket-client')()
  , requestSender = require('./lib/request-sender')()

app.unknownOption = function (arg) {
  console.log('')
  console.log('  Unknown option "' + arg + '"')
  app.help()
  process.exit(0)
}

app
  .version('0.0.1')
  .option('-a, --admiral [http://127.0.0.1:8006]', 'Admiral host to connect to [http://127.0.0.1:8006]')

app
  .command('history')
  .description('View a history of issued Orders')
  .action(function () {
    console.log('viewing history...')
  })

app
  .command('issue')
  .description('Issue an order to your Captains')
  .action(function (appId, order) {
    if (typeof order === 'object') {
      order = null
    }
    var orderArgs = _.toArray(arguments)
    orderArgs.splice(0, 2)
    orderArgs.splice(orderArgs.length - 1, 1)
    socketClient.connect(app.admiral, function (error, client, clientId) {
      if (error) {
        console.log('Unable to connect to Admiral...')
        return
      } else if (!order) {
        console.log('listing all captains application orders...')
        socketClient.sendListOrdersRequest(appId, client, clientId, function (response) {
          if (response.success) {
            response.orders.forEach(function (order) {
              console.log(order)
            })
          } else {
            console.log(response.message)
          }
          client.end()
        })
      } else  {
        console.log('issuing order "' + order + '" for application "' + appId + '" with args: ' + orderArgs)
        requestSender.sendExecuteOrderRequest(order, appId, orderArgs, client, clientId, function (response) {
          if (response.success) {
            console.log('order complete!')
          } else {
            console.log(response.message)
          }
          client.end()
        })
      }
    })
  })

app
  .command('list')
  .description('List available Applications')
  .action(function () {
    console.log('listing...')
  })

app
  .command('login')
  .description('Authenticate with The Admiral')
  .action(function () {
    console.log('authenticating...')
  })

app
  .command('manage')
  .description('Manage your Applications')
  .action(function () {
    console.log('managing...')
  })

app.parse(process.argv)

if (typeof app.args[app.args.length - 1] !== 'object') {
  app.help()
}
