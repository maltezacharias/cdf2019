'use strict'

const model = require('./Model')

function exitHandler (options, exitCode) {
  if (options.cleanup) console.log('Clean Shutdown')
  if (exitCode || exitCode === 0) console.log('Process killed or exception', exitCode)
  model.saveSync()
  if (options.exit) process.exit()
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }))

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

const app = require('express')()
const http = require('http').createServer(app)

app.get('/', function (req, res) {
  let modelData = model.getModel()
  res.json(modelData)
})

http.listen(3000, function () {
  console.log('listening on *:3000')
  model.addEvent('server_start', null)
})
