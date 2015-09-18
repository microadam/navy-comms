var Table = require('cli-table')
  , prettyjson = require('prettyjson')
  , async = require('async')
  , inquirer = require('inquirer')
  , captureData = require('../util/capture-data')
  , showUsage = require('../util/usage')

module.exports = function (serviceLocator) {

  serviceLocator.app
    .command('manage')
    .description('manage applications')
    .action(function (subcommand, appId) {
      /* jshint maxcomplexity: 7 */
      if (typeof appId === 'object') appId = null

      serviceLocator.connectToAdmiral(serviceLocator.app.admiral, function (client) {
        switch (subcommand) {
        case 'list':
          listApplications(client)
          break;
        case 'add':
          newApplication(client)
          break;
        case 'view':
          viewApplication(appId, client)
          break;
        case 'edit':
          editApplication(appId, client)
          break;
        case 'delete':
          deleteApplication(appId, client)
          break;
        default:
          displayUsage(client)
        }
      })

    })

  function listApplications(client) {
    client.send('applicationList', null, function (applications) {
      var table = new Table(
        { head: [ 'Name', 'AppId', 'Added By', 'Date Created' ]
        }
      )

      applications.forEach(function (item) {
        table.push([ item.config.name, item.config.appId, item.createdBy, item.createdDate ])
      })

      console.log(table.toString())
      client.end()
    })
  }

  function newApplication(client) {
    var defaultConfig =
      { name: '<application name here>'
      , appId: '<appId here>'
      }

    async.waterfall
    ( [ function (waterCallback) {
          captureData(null, defaultConfig, 'new', waterCallback)
        }
      , function (data, waterCallback) {
          client.send('applicationCreate', data, function (response) {
            waterCallback(null, response)
          })
        }
      ]
    , function (error) {
        if (error) {
          throw error
        }
        console.log('Application Added')
        client.end()
      }
    )
  }

  function viewApplication(appId, client) {
    if (!appId) {
      return displayUsage(client)
    }

    var data = { appId: appId }

    client.send('applicationGet', data, function (response) {
      console.log('')
      console.log('  Current config for: ' + appId)
      console.log('')
      console.log('   ', prettyjson.render(response).replace(/\n/g, '\n    '))
      console.log('')
      client.end()
    })

  }

  function editApplication(appId, client) {
    if (!appId) {
      return displayUsage(client)
    }

    async.waterfall
    ( [ function (waterCallback) {
          var data = { appId: appId }
          client.send('applicationGet', data, function (response) {
            waterCallback(null, response)
          })
        }
      , function (data, waterCallback) {
          captureData(appId, data.config, 'edit', waterCallback)
        }
      , function (data, waterCallback) {
          client.send('applicationEdit', data, function () {
            waterCallback(null)
          })
        }
      ]
    , function (error) {
        if (error) {
          throw error
        }
        console.log('Application Edited')
        client.end()
      }
    )
  }

  function deleteApplication(appId, client) {
    if (!appId) {
      return displayUsage(client)
    }
    var question =  'Are you sure you wish to delete ' + appId + '?'
      , data = { type: 'confirm', name: 'doDelete', message: question, default: false }
    inquirer.prompt(data, function (answer) {
      if (answer.doDelete) {
        client.send('applicationDelete', { appId: appId }, function () {
          client.end()
        })
      } else {
        client.end()
      }
    })
  }

  function displayUsage(client) {
    var usage =
    [ [ 'list', 'list all applications' ]
    , [ 'add', 'add a new application' ]
    , [ 'view <appId>', 'view details of an existing application' ]
    , [ 'edit <appId>', 'edit details of an existing application' ]
    , [ 'delete <appId>', 'delete an existing application' ]
    ]
    showUsage('manage', usage)
    client.end()
  }

}
