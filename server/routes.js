module.exports = { 
  routes: [
    { path: '/getModel', handler: require('./actions/getModel') },
    { path: '/startSpeaking/:fraktion', handler: require('./actions/startSpeaking') },
    // { path: '', handler: require(./actions/) },
  ]
}