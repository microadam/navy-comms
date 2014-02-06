var Table = require('cli-table')
  , captureData = require('../util/capture-data')
  , showUsage = require('../util/usage')
  , prettyjson = require('prettyjson')

module.exports = function (serviceLocator, app) {

  app
    .command('manage')
    .description('manage applications')
    .action(function (subcommand, appId) {
      /* jshint maxcomplexity: 7 */
      if (typeof appId === 'object') appId = null

      switch (subcommand) {
      case 'list':
        listApplications()
        break;
      case 'add':
        newApplication()
        break;
      case 'view':
        viewApplication(appId)
        break;
      case 'edit':
        editApplication(appId)
        break;
      case 'delete':
        console.log('deleting...')
        break;
      default:
        displayUsage()
      }
    })

  function listApplications() {
    var table = new Table(
      { head: [ 'Name', 'AppId', 'Added By', 'Date Created' ]
      }
    )

    table.push
    ( [ 'Test Application', 'testapp', 'Fred Blogs', '01 Jan 2014' ]
    , [ 'Hiss Bang Whallop', 'hissbang', 'John Smith', '14 Nov 2013' ]
    , [ 'Foo Bar Baz', 'foobarbaz', 'Dave Davidson', '22 Sep 2014' ]
    )

    console.log(table.toString())
  }

  function newApplication() {
    var defaultConfig =
      { name: '<application name here>'
      , appId: '<appId here>'
      }
    captureData(null, defaultConfig, 'new', function (error, data) {
      if (error) {
        throw error
      } else {
        console.log(data)
      }
    })
  }

  function viewApplication(appId) {
    if (!appId) {
      return displayUsage()
    }

    var data =
    { 'name': 'Test Application'
    , 'appId': 'testapp'
    , 'environments':
      { 'staging': { 'url': 'http://staging.testapp.com' }
      , 'production': { 'url': 'http://testapp.com' }
      }
    }

    console.log('')
    console.log('  Current config for: ' + appId)
    console.log('')
    console.log('   ', prettyjson.render(data).replace(/\n/g, '\n    '))
    console.log('')
  }

  function editApplication(appId) {

    var currentData =
    { 'name': 'Test Application'
    , 'appId': 'testapp'
    , 'environments':
      { 'staging': { 'url': 'http://staging.testapp.com' }
      , 'production': { 'url': 'http://testapp.com' }
      }
    }

    captureData(appId, currentData, 'edit', function (error, data) {
      if (error) {
        throw error
      } else {
        console.log(data)
      }
    })
  }

  function displayUsage() {
    var usage =
    [ [ 'list', 'list all applications' ]
    , [ 'add', 'add a new application' ]
    , [ 'view <appId>', 'view details of an existing application' ]
    , [ 'edit <appId>', 'edit details of an existing application' ]
    , [ 'delete <appId>', 'delete an existing application' ]
    ]
    showUsage('manage', usage)
  }

}
