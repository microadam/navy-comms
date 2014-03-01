var _ = require('lodash')
  , showUsage = require('../util/usage')

module.exports = function (serviceLocator) {

  serviceLocator.app
    .command('order')
    .description('issue an order to your Captains')
    .action(function (appId, order) {
      if (typeof appId === 'object') appId = null
      if (typeof order === 'object') order = null
      var orderArgs = _.toArray(arguments)
      orderArgs.splice(0, 2)
      orderArgs.splice(orderArgs.length - 1, 1)

      serviceLocator.connectToAdmiral(serviceLocator.app.admiral, function (client, clientId) {
        if (!appId) {
          displayUsage(client)
        } else if (!order) {
          listOrders(appId, client, clientId)
        } else {
          issueOrder(appId, order, orderArgs, client, clientId)
        }
      })
    })

  function listOrders(appId, client, clientId) {
    console.log('listing all captains application orders...')
    var data = { appId: appId, clientId: clientId }
    client.send('orderList', data, function (response) {
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
    var data =
      { appId: appId
      , order: order
      , orderArgs: orderArgs
      , clientId: clientId
      }
    client.send('executeOrder', data, function (response) {
      if (response.success) {
        console.log('order complete!')
      } else {
        console.log(response.message)
      }
      client.end()
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

}
