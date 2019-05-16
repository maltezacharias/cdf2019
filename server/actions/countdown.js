module.exports = function(req,res) {
  let duration = parseInt(req.query.duration)
  let mode = req.query.mode
  let model = req.app.locals.model

  console.log(duration,typeof(duration))

  if(mode === 'start' ) {
    if (isNaN(duration) || duration <= 0) {
      res.json({ "success": false, error: "duration missing or invalid" })
      return
    }
    model.startCountdown(duration) 
  } else if (mode === 'stop') {
    model.stopCountdown()
  }

  model.save((err) => {
    if (err) {
      res.json({ sucess: false, error: err })
    } else {
      res.json({ sucess: true })
    }
  })
}