module.exports = function createConfigManager(serviceLocator) {

  function get(key, callback) {
    serviceLocator.db.get(key, function (error, value) {
      if (error && Object.keys(error).length) console.error(error)
      callback(value)
    })
  }

  function set(key, value) {
    serviceLocator.db.put(key, value, function (error) {
      if (error) console.error(error)
    })
  }

  return {
    get: get
  , set: set
  }

}
