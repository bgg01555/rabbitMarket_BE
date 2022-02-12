const express = require("express")
const connect = require("./models")
const port = 3000
const app = express()
const cors = require("cors")
const authMiddleware = require("./middlewares/auth-middleware")
connect()

const userRouter = require("./routes/user")

//body 읽기
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// app.use("/api", [goodsRouter, cartsRouter]);
// 여러 라우터를 사용할 경우 배열 형태로 배치
app.use("/api", [userRouter])

app.get("/", (req, res) => {
  res.send("Hello World1")
})

//app.use("/api");
app.listen(port, () => {
  console.log("running on port", port)
})
