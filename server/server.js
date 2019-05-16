'use strict'

const model = require('./Model')
const routes = require('./routes').routes

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
app.locals.model = model;
console.log(routes);
routes.forEach((route) =>  { app.get(route.path, route.handler ) })

http.listen(3000, function () {
  model.addEvent('server_start', null, 'listening on *:3000')
})
