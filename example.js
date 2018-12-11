
const Koa = require('koa')
const crypto = require('mz/crypto')

const app = new Koa()

require('./')(app)

app.use(async function (ctx, next) {
  const start = Date.now()
  ctx.id = await crypto.randomBytes(12)

  ctx.trace('start')

  await next()

  ctx.trace('finish')
  ctx.set('X-Response-Time', (Date.now() - start) + 'ms')
})

app.use(async function (ctx, next) {
  ctx.trace('wait:before')

  function delay () {
    return new Promise((resolve) => {
      setTimeout(resolve, Math.random() * 100)
    })
  }

  await delay()

  ctx.trace('wait:after')

  await next()
})

app.use(async function (ctx, next) {
  ctx.trace('user.id', random())
  ctx.trace('some.event', random(), random())
  ctx.trace('another.event', random(), random())
  ctx.body = 'hello world!'
})

app.debug()

const port = process.env.PORT || 3210
app.listen(port)
console.log('koa-trace example listening on port %s', port)

function random() {
  return Math.random().toString(36).slice(2)
}
