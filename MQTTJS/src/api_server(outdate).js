const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})
// POST method route
app.post('/data', (req, res) => {
  res.send(req.body)
})
const port = 3200;
app.listen(port,()=>{
  console.log("start server "+port)
})