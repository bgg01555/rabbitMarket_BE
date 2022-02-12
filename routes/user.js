const express = require("express")
const router = express.Router()
const User = require("../models/user")
//const authMiddleware = require("./middlewares/auth-middleware")
const jwt = require("jsonwebtoken")

//회원가입페이지 보여주기
router.get("/users/signup", (req, res) => {
  res.render("register")
})

//회원가입
router.post("/signup", async (req, res) => {
  const { userId, nickname, password } = req.body

  const user = new User({ userId, nickname, password })
  user.save()

  res.status(201).send({})
})

//로그인 시켜주기
//로그인 api
router.post("/login", async (req, res) => {
  const { userId, nickname, password } = req.body
  const user = await User.findOne({ userId, nickname, password }).exec()

  //id,pw 가 일치하지 않는 유저
  if (!user) {
    res.status(400).send({ errorMessage: "이메일 또는 패스워드가 잘못되었습니다." })
    return
  }

  //로그인 성공, 토큰 발급
  const token = jwt.sign({ userId }, "MY-SECRET-KEY")
  res.send({ token })
})

// //모든기기 로그아웃
// router.post("/users/logoutAll", authMiddleware, async (req, res) => {
//   try {
//     req.user.tokens = []
//     await req.user.save()
//     res.status(201).send()
//   } catch (e) {
//     res.status(500).send()
//   }
// })

module.exports = router
