module.exports = function(req,res) {
  let model = req.app.locals.model
  model.setTopic( req.query.topic )
  res.json({ success: true})
}