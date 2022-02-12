const express = require("express")
const connect = require("./models")
const user = require('./models/user')
const port = 3000
const app = express()
connect()

//body 읽기
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const postRouter = require("./routes/post");
app.use("/api", [postRouter]/* [goodRouter,userRouter] 이런식으로 쓸수도*/);

app.get("/", async (req, res) => {
  //await user.create({ userId: 'test', password: 'test', nickname: 'test' });
  res.send("Hello World")
})

app.listen(port, () => {
  console.log("running on port", port)
})
