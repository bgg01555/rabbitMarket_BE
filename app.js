const express = require("express")
const connect = require("./models")
const port = 3000
const app = express()
const cors = require("cors")
connect()

//body 읽기
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World1")
})

//app.use("/api");
app.listen(port, () => {
  console.log("running on port", port)
})
