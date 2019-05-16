'use strict'
const path = require('path')
const fs = require('fs')
var modelState = {}

fs.readFile(path.join(__dirname, '/state.json'), (err, data) => {
  if (err) throw err
  modelState = JSON.parse(data)
  console.log('Read Model', modelState)
})

module.exports = {
  saveSync () {
    console.log('Saving synchronously')
  },
  getModel () {
    modelState.timestamp = Date.now().getTime()
    return modelState
  }
}
