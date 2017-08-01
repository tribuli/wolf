const express = require('express')
const bluebird = require('bluebird')
const mongoose = require('mongoose')
const index = require('./controller/index')
const config = {
  mongodb : "mongodb://localhost:27017/movielist"
}

mongoose.connect(config.mongodb)
mongoose.Promise = bluebird

const app = express()
const port = process.env.PORT || 3000

app.use('/api',index)

app.listen(port, () => {
  console.log(`database has been connected, listening on port ${port}`)
})

module.exports = app
