module.exports = { 
  routes: [
    { path: '/model', handler: require('./actions/getModel') },
    { path: '/startSpeaking', handler: require('./actions/startSpeaking') },
    { path: '/stopSpeaking', handler: require('./actions/stopSpeaking') },
    { path: '/save', handler: require('./actions/save') },
    { path: '/stop', handler: require('./actions/stop') },
    { path: '/countdown', handler: require('./actions/countdown') },
    // { path: '', handler: require(./actions/) },
  ]
}