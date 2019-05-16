'use strict'
const path = require('path')
const fs = require('fs')
const stateFile = path.join(__dirname, '/state.json')
var modelState = {}

function readFile () {
  let data = fs.readFileSync(stateFile, 'utf8')
  modelState = JSON.parse(data)
  console.log('Read Model', modelState)
}

readFile()

module.exports = {
  saveSync () {
    console.log('Saving synchronously', JSON.stringify(modelState))
  },
  save (callback) {
    console.log('Saving asynchronously', JSON.stringify(modelState))
    let currentState = JSON.stringify(modelState, null, 2)
    fs.writeFile(stateFile, currentState, callback)
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
    modelState.fraktionen.forEach((fraktion) => {
      let now = this.getTimestamp();
      if (fraktion.speakingSince) {
        let timeElapsedBefore = fraktion.timeElapsed
        let timeSpoken = now - fraktion.speakingSince
        fraktion.timeElapsed = fraktion.timeElapsed + timeSpoken
        fraktion.speakingSince = null
        this.addEvent('stop_speaking',fraktion.id,{ oldTime: timeElapsedBefore, timeSpoken: timeSpoken, newTime: fraktion.timeElapsed })
      } 
       
    })
  },
  startCountdown (seconds) {

  },
  addEvent (type, fraktion, message) {
    let event = { timestamp: Date.now(), type: type, fraktion: fraktion, message: message || '' }
    modelState.events.push(event)
    console.log(event)
  }
}
