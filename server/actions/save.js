module.exports = function(req,res) {
  let model = req.app.locals.model
  model.save((err) => {
    if (err) {
      res.json({ sucess: false, error: err })
    } else {
      res.json({ sucess: true })
    }
  })
}