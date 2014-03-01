var should = require('should')
  , bootstrap = require('../bootstrap')

describe('bootstrap', function () {

  it('should load all required modules', function () {
    bootstrap(function (serviceLocator) {
      should.exist(serviceLocator.db)
      should.exist(serviceLocator.app)
      should.exist(serviceLocator.config)
      should.exist(serviceLocator.connectToAdmiral)
      should.exist(serviceLocator.socketClient)
    })
  })

})
