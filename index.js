
var slice = [].slice

module.exports = function (app) {
  // trace something
  app.context.trace = function trace(event) {
    var args = []
    switch (arguments.length) {
    case 0:
      throw new Error('No event defined!')
    case 1: break
    case 2:
      args = [arguments[1]]
      break
    default:
      args = slice.call(arguments, 1)
    }

    dispatch(this, event, args)
    return this
  }

  // attach a listener
  app.instrument = instrument

  // log all events to the debugger
  app.debug = function () {
    var Debug = require('debug')

    app.instrument(function (context, event, date, args) {
      var id = context.id
      if (!id) throw new Error('you need to set `this.id` to debug')
      if (Buffer.isBuffer(id)) id = id.toString('base64')
      var debug = context.debug
      if (!debug) debug = context.debug = Debug('koa-trace:' + id)

      var output = ''
      switch (args.length) {
      case 0: break
      case 1:
        output = args[0]
        break
      default:
        output = args
      }
      debug(event, output)
    })

    return this
  }

  // attach a listener
  var listeners = []
  function instrument(fn) {
    listeners.push(fn)
    return this
  }

  // dispatch an event to all listeners
  function dispatch(context, event, args) {
    var date = new Date()
    for (var i = 0; i < listeners.length; i++)
      listeners[i](context, event, date, args)
  }

  return app
}
