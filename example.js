
var koa = require('koa')
var crypto = require('mz/crypto')

var app = koa()

require('./')(app)

app.use(function* (next) {
  var start = Date.now()
  this.id = yield crypto.randomBytes(12)

  this.trace('start')

  yield* next

  this.trace('finish')
  this.set('X-Response-Time', (Date.now() - start) + 'ms')
})

app.use(function* (next) {
  this.trace('wait:before')
  yield function (done) {
    setTimeout(done, Math.random() * 100)
  }
  this.trace('wait:after')

  yield* next
})

app.use(function* (next) {
  this.trace('user.id', random())
  this.trace('some.event', random(), random())
  this.trace('another.event', random(), random())
  this.body = 'hello world!'
})

app.debug()

var port = process.env.PORT || 3210
app.listen(port)
console.log('koa-trace example listening on port %s', port)

function random() {
  return Math.random().toString(36).slice(2)
}
