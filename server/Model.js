'use strict'
const path = require('path')
const fs = require('fs')
var modelState = {}

function readFile () {
  let data = fs.readFileSync(path.join(__dirname, '/state.json'), 'utf8')
  modelState = JSON.parse(data)
  console.log('Read Model', modelState)
}

readFile()

module.exports = {
  saveSync () {
    console.log('Saving synchronously', JSON.stringify(modelState))
  },
  getTimestamp () {
    return Date.now()
  },
  getModel () {
    modelState.timestamp = Date.now()
    return modelState
  },
  getFraktion (id) {
    return modelState.fraktionen.find((e) => { return e.id === id })
  },
  startTimer (id) {
    this.stopTimer()
    let fraktion = this.getFraktion(id)
    if (!fraktion) {
      console.log('Can\'t start timer for non existing fraktion ', id)
      return
    }
    fraktion.speakingSince = this.getTimestamp()
    this.addEvent('start_speaking', fraktion.id)
  },
  stopTimer () {
    modelState.fraktionen.forEach((fraktion) => { fraktion.speakingSince = null })
  },
  addEvent (type, fraktion, message) {
    let event = { timestamp: Date.now(), type: type, fraktion: fraktion, message: message || '' }
    modelState.events.push(event)
    console.log(event)
  }
}
