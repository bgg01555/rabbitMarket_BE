const express = require("express")
const connect = require("./models")
const port = 3000
const app = express()
const cors = require("cors")
const commentsRouter = require("./routes/comment")

connect()

//body 읽기
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// 여러 라우터를 사용할 경우 배열 형태로 배치
app.use("/api", commentsRouter)

app.get("/", (req, res) => {
  res.send("Hello World1")
})

//app.use("/api");
app.listen(port, () => {
  console.log("running on port", port)
})
