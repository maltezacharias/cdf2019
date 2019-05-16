module.exports = function(req,res) {
  let model = req.app.locals.model
  model.stopTimer()
  res.json({ success: true});
}