'use strict'
const path = require('path')
const fs = require('fs')
const stateFile = path.join(__dirname, '/state.json')
var modelState = {}

function readFile () {
  let data = fs.readFileSync(stateFile, 'utf8')
  modelState = JSON.parse(data)
  console.log('Read Model')
}

readFile()

module.exports = {
  emitModel () {
    this.io.emit('model',this.getModel())
  },
  saveSync () {
    console.log('Saving synchronously')//, JSON.stringify(modelState))
    let currentState = JSON.stringify(modelState, null, 2)
    fs.writeFileSync(stateFile, currentState)
  },
  save (callback) {
    console.log('Saving asynchronously')//, JSON.stringify(modelState))
    let currentState = JSON.stringify(modelState, null, 2)
    fs.writeFile(stateFile, currentState, callback)
  },
  getTimestamp () {
    return Date.now()
  },
  getModel (withEvents) {
    modelState.timestamp = Date.now()
    let responseData = { 
      timestamp: modelState.timestamp,
      topic: modelState.topic,
      timer: modelState.timer,
      fraktionen: modelState.fraktionen,
    }
    if(withEvents) {
      responseData.events = modelState.events
    }
    return responseData
  },
  getFraktion (id) {
    return modelState.fraktionen.find((e) => { return e.id === id })
  },
  startTimer (id) {
    let fraktion = this.getFraktion(id)
    if (!fraktion) {
      console.log('Can\'t start timer for non existing fraktion ', id)
      return
    }
    if (fraktion.speakingSince) {
      this.addEvent('still_speaking',fraktion.id,"still speaking, not stopping/starting")
      return
    }
    this.stopTimer()
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
    this.addEvent('start_countdown',null, {})
    modelState.timer.runningSince = this.getTimestamp()
    modelState.timer.durationSeconds = seconds

  },
  stopCountdown () {
    this.addEvent('stop_countdown',null, {})
    modelState.timer.runningSince = null

  },
  setTopic (topic) {
    this.addEvent('set_topic', null, { topic: topic})
    modelState.topic = topic

  },
  reset () {
    modelState.fraktionen.forEach((fraktion) => {
      fraktion.speakingSince = null;
      fraktion.timeElapsed = 0;
    })
    modelState.timer.runningSince = 0;
    modelState.timer.durationSeconds = 0;
    modelState.events = [];
    this.addEvent('reset',null,null)
  },
  addEvent (type, fraktion, message) {
    let event = { timestamp: Date.now(), type: type, fraktion: fraktion, message: message || '' }
    modelState.events.push(event)
    console.log(JSON.stringify(event,null,0))
    this.emitModel()
  }
}
