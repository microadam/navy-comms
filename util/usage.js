var columnify = require('columnify')

module.exports = function showUsage(command, data) {

  var columns = columnify(data, { columnSplitter: '          ' })
  columns = columns.replace(/\n/g, '\n    ')
  columns = columns.substring(columns.indexOf('\n'), columns.length)

  console.log('')
  console.log('  Usage: comms ' + command + ' [command]')
  console.log('')
  console.log('  Commands:')
  console.log(columns)
  console.log('')

}
