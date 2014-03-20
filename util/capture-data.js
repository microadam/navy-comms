var fs = require('fs')
  , cp = require('child_process')
  , async = require('async')
  , formatJson = require('format-json')

module.exports = function captureData(appId, currentData, type, callback) {

  if (!appId) {
    appId = 'new'
  }

  var fileName = '.comms-' + appId + '.tmp'

  if (!currentData) {
    currentData = ''
  } else {
    currentData = formatJson.diffy(currentData)
  }

  var comment = '# Current config for: ' + appId
  if (type === 'new') {
    comment = '# Modify the config below for this new application'
  }

  getData(fileName, currentData, comment, callback)
}

function getData(fileName, currentData, comment, callback) {
  var editorPath = process.env.EDITOR || 'vim'
  async.waterfall
  ( [ function (waterCallback) {
        var data = comment + '\n\n' + currentData
        fs.writeFile(fileName, data, waterCallback)
      }
    , function (waterCallback) {
        var editor = cp.spawn(editorPath, [ fileName ], { stdio: 'inherit' })
        editor.on('exit', function () {
          waterCallback()
        })
      }
    , function (waterCallback) {
        fs.readFile(fileName, function (error, data) {
          data = data.toString()
          // remove comments
          var lines = data.split('\n')
            , commentFreeData = []
          lines.forEach(function (line) {
            if (line.indexOf('#') === -1) {
              commentFreeData.push(line)
            }
          })
          data = commentFreeData.join('\n').trim()
          waterCallback(error, data)
        })
      }
    , function (fileContents, waterCallback) {
        try {
          var parsedContents = JSON.parse(fileContents)
          waterCallback(null, parsedContents)
        } catch (e) {
          var errorComment = '# JSON is invalid. Please correct and re-save'
          fileContents = errorComment + '\n\n' + fileContents
          getData(fileName, fileContents, comment, waterCallback)
        }
      }
    , function (fileContents, waterCallback) {
        fs.unlink(fileName, function (error) {
          waterCallback(error, fileContents)
        })
      }
    ]
  , function (error, fileContents) {
      if (error && error.code === 'ENOENT' && error.path === fileName) {
        error = null
      }
      callback(error, fileContents)
    }
  )
}
