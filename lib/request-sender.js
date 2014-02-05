module.exports = function createRequestSender() {

  function sendRegisterRequest(client, callback) {
    var data = { request: 'register' }
    send(client, data, callback)
  }

  function sendListOrdersRequest(appId, client, clientId, callback) {
    var data =
      { request: 'orderList'
      , appId: appId
      , clientId: clientId
      }
    send(client, data, callback)
  }

  function sendExecuteOrderRequest(order, appId, orderArgs, client, clientId, callback) {
    var data =
      { request: 'executeOrder'
      , appId: appId
      , order: order
      , orderArgs: orderArgs
      , clientId: clientId
      }
    send(client, data, callback)
  }

  function send(client, data, callback) {
    data.type = 'client'
    client.writeAndWait(data, callback)
  }

  return {
    sendRegisterRequest: sendRegisterRequest
  , sendListOrdersRequest: sendListOrdersRequest
  , sendExecuteOrderRequest: sendExecuteOrderRequest
  }
}
