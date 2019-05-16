'use strict'
const path = require('path')
const express = require('express')
const model = require('./Model')
const routes = require('./routes').routes
const publicPath = path.join(__dirname, '../public')

function exitHandler (options, exitCode) {
  if (options.cleanup) console.log('Clean Shutdown')
  if (exitCode || exitCode === 0) console.log('Process killed or exception', exitCode)

  model.addEvent('stop_server',null,{ options: options, exitCode: exitCode })
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

const app = express()
const cacheHeaders = require('express-cache-headers');
app.use(cacheHeaders({ ttl: 0, nocache: true }))
const http = require('http').createServer(app)
const io = require('socket.io')(http);
app.locals.model = model;
model.io = io;
app.locals.io = io;
routes.forEach((route) =>  { app.get(route.path, route.handler ) })
app.use(express.static(publicPath))


http.listen(3000, function () {
  model.addEvent('server_start', null, 'listening on *:3000')
})

io.on('connection', function(socket){
  console.log('WebSocket: User connected');
});

// Schedule auto-save
setInterval(() => {
  model.addEvent('autosave',null,{})
  model.save(() => {})
},60000)