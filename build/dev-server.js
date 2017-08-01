const config = require('../config')
const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddlware = require('http-proxy-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const connect = require('connect-history-api-fallback')
const webpackConfig = require('./webpack.dev.conf')

const port = process.env.PORT || config.dev.port

const proxyTable = {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}

const app = express()
const compiler = webpack(webpackConfig)
const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = webpackHotMiddleware(compiler, {})

compiler.plugin('compilation', compilation => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload'})
    cb()
  })
})

Object.keys(proxyTable).forEach(context => {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddlware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(connect())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (config.dev.autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})