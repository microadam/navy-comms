var _ = require('lodash')
  , showUsage = require('../util/usage')

module.exports = function (serviceLocator) {

  serviceLocator.app
    .command('order')
    .description('issue an order to your Captains')
    .action(function (appId, environment, order) {
      if (typeof appId === 'object') appId = null
      if (typeof environment === 'object') environment = null
      if (typeof order === 'object') order = null
      var orderArgs = _.toArray(arguments)
      orderArgs.splice(0, 3)
      orderArgs.splice(orderArgs.length - 1, 1)

      serviceLocator.connectToAdmiral(serviceLocator.app.admiral, function (client, clientId) {
        if (!appId || !environment) {
          displayUsage(client)
        } else if (!order) {
          listOrders(appId, environment, client, clientId)
        } else {
          issueOrder(appId, environment, order, orderArgs, client, clientId)
        }
      })
    })

  function listOrders(appId, environment, client, clientId) {
    console.log('listing all captains application orders...')
    var data = { appId: appId, environment: environment, clientId: clientId }
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

  function issueOrder(appId, environment, order, orderArgs, client, clientId) {
    var msg =
      [ 'issuing order "' + order + '" for application "' + appId
      , '" on environment "' + environment + '" with args: ' + orderArgs
      ]
    console.log(msg.join(''))

    serviceLocator.config.get('username', function (username) {
      if (!username) {
        // TODO: Should really be server side validated
        console.log('ERROR: Username must be set before issuing orders')
        console.log('Set using "comms config set username <username>"')
        client.end()
      }
      var data =
        { appId: appId
        , environment: environment
        , order: order
        , orderArgs: orderArgs
        , clientId: clientId
        , username: username
        }
      client.send('executeOrder', data, function (response) {
        if (response.success) {
          console.log('order complete')
        } else {
          console.log(response.message)
        }
        serviceLocator.notifier.notify({ title: 'Navy Comms', message: order + ' completed' })
        client.end()
      })
    })
  }

  function displayUsage(client) {
    var usage =
    [ [ '<appId> <environment>'
      , 'list all orders that this application can execute on the given environment'
      ]
    , [ '<appId> <environment> <order>'
      , 'issue the given order to all of this applications Captains on the given environment'
      ]
    ]
    showUsage('order', usage)
    client.end()
  }

}
