module.exports = function createRequestSender() {

  function sendRegisterRequest(client, callback) {
    client.send('register', null, callback)
  }

  function sendListOrdersRequest(appId, client, clientId, callback) {
    var data =
      { appId: appId
      , clientId: clientId
      }
    client.send('orderList', data, callback)
  }

  function sendExecuteOrderRequest(order, appId, orderArgs, client, clientId, callback) {
    var data =
      { appId: appId
      , order: order
      , orderArgs: orderArgs
      , clientId: clientId
      }
    client.send('executeOrder', data, callback)
  }

  return {
    sendRegisterRequest: sendRegisterRequest
  , sendListOrdersRequest: sendListOrdersRequest
  , sendExecuteOrderRequest: sendExecuteOrderRequest
  }
}
