module.exports = function(req,res) {
  let modelData = req.app.locals.model.getModel()
  let responseData = { 
    timestamp: modelData.timestamp,
    timer: modelData.timer,
    fraktionen: modelData.fraktionen,
  }
  if(req.query.events) {
    responseData.events = modelData.events
  }
  res.json(responseData)
}