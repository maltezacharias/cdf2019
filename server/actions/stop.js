module.exports = function(req,res) {
  let model = req.app.locals.model
  model.addEvent('server_shutdown', null, "server shutdown requested")
  model.save((err) => {
    if (err) {
      res.json({ sucess: false, error: err })
    } else {
      res.json({ sucess: true })
      process.exit(0)
    }
  })
}