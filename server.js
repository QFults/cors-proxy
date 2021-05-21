const express = require('express')
const axios = require('axios')
const app = express()

app.use(require('cors')())

app.get('*', (req, res) => {
  const targetURL = req.header('Target-URL')
  if (!targetURL) {
    res.status(500).send({ error: 'There is no Target-URL header in the request' })
  }
  axios.get(targetURL, {
    headers: { Authorization: req.header('Authorization') }
  })
    .then(response => {
      console.log(response)
      res.json(response.data)
    })
    .catch(err => res.status(500).send(err))
})

app.listen(process.env.PORT || 3000)
