var _ = require('lodash')
  , async = require('async')
  , showUsage = require('../util/usage')

module.exports = function (serviceLocator, app) {

  var socketClient = serviceLocator.socketClient
    , requestSender = serviceLocator.requestSender
    , admiralHost = app.admiral

  app
    .command('order')
    .description('issue an order to your Captains')
    .action(function (appId, order) {
      if (typeof appId === 'object') appId = null
      if (typeof order === 'object') order = null
      var orderArgs = _.toArray(arguments)
      orderArgs.splice(0, 2)
      orderArgs.splice(orderArgs.length - 1, 1)

      async.waterfall
      ( [ determineAdmiralHost
        , socketClient.connect
        ]
      , function (error, client, clientId) {
          if (error) {
            console.error('Unable to connect to Admiral at: ' + admiralHost)
          } else if (!appId) {
            displayUsage(client)
          } else if (!order) {
            listOrders(appId, client, clientId)
          } else {
            issueOrder(appId, order, orderArgs, client, clientId)
          }
        }
      )
    })

  function determineAdmiralHost(callback) {
    serviceLocator.config.get('admiral', function (value) {
      if (!admiralHost && value && typeof value !== 'object') {
        admiralHost = value
      }
      callback(null, admiralHost)
    })
  }

  function displayUsage(client) {
    var usage =
    [ [ '<appId>', 'list all orders that this application can execute' ]
    , [ '<appId> <order>', 'issue the given order to all of this applications Captains' ]
    ]
    showUsage('order', usage)
    client.end()
  }

  function listOrders(appId, client, clientId) {
    console.log('listing all captains application orders...')
    requestSender.sendListOrdersRequest(appId, client, clientId, function (response) {
      if (response.success) {
        response.orders.forEach(function (order) {
          console.log(order)
        })
      } else {
        console.log(response.message)
      }
      client.end()
    })
  }

  function issueOrder(appId, order, orderArgs, client, clientId) {
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

}
