module.exports = function(req,res) {
  let model = req.app.locals.model
  let fraktion = req.query.fraktion
  model.startTimer(fraktion)
  res.json({ success: true})
}