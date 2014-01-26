var requestSender = require('../../lib/request-sender')()
  , client =
      { writeAndWait: function (data, callback) {
          callback(data)
        }
      }

describe('request-sender', function () {

  describe('sendRegisterRequest()', function () {

    it('should send correct data', function (done) {

      requestSender.sendRegisterRequest(client, function (data) {
        Object.keys(data).length.should.equal(2)
        data.request.should.equal('register')
        data.type.should.equal('client')
        done()
      })

    })

  })

  describe('sendListOrdersRequest()', function () {

    it('should send correct data', function (done) {
      var appId = 'appIdOne'
        , clientId = 1234

      requestSender.sendListOrdersRequest(appId, client, clientId, function (data) {
        Object.keys(data).length.should.equal(4)
        data.request.should.equal('orderList')
        data.appId.should.equal('appIdOne')
        data.clientId.should.equal(1234)
        data.type.should.equal('client')
        done()
      })

    })

  })

  describe('sendExecuteOrderRequest()', function () {

    it('should send correct data', function (done) {
      var order = 'test'
        , appId = 'appIdOne'
        , orderArgs = 'args'
        , clientId = 1234

      requestSender.sendExecuteOrderRequest(order, appId, orderArgs, client, clientId, function (data) {
        Object.keys(data).length.should.equal(6)
        data.request.should.equal('executeOrder')
        data.appId.should.equal('appIdOne')
        data.orderArgs.should.equal('args')
        data.clientId.should.equal(1234)
        data.type.should.equal('client')
        done()
      })

    })

  })

})
