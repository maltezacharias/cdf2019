module.exports = function(req,res) {
  let modelData = req.app.locals.model.getModel()
  res.json(modelData)
}