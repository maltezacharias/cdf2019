module.exports = function(req,res) {
  let modelData = req.app.locals.model.getModel(req.query.events)
  res.json(modelData)
}