module.exports = function(req,res) {
  let model = req.app.locals.model
  model.reset()
  res.json({ success: true})
}