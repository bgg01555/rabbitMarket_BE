const express = require("express")
const Users = require("../models/user")
const Joi = require("joi")
const authMiddleware = require("./middlewares/auth-middleware")
const router = express.Router()

/**
 * 회원가입 API.
 * 특정 pattern을 미리 정규표현식으로 정의하여, 변수로 선언해둔다.
 * postUserSchema 는 userId, nickname, password에 대해 Joi 라이브러리를 통해 조건을 명시함.
 */
const userId_pattern = /^[a-z|A-Z|0-9]+$/ // userId는 알파벳 대소문자 (a~z, A~Z), 숫자(0~9)로 구성
const nickname_pattern = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]+$/ // 닉네임은 한글, 알파벳 대소문자 (a~z, A~Z), 숫자(0~9)로 구성
const postUserSchema = Joi.object({
  loginId: Joi.string().min(3).pattern(new RegExp(userId_pattern)).required(),
  password: Joi.string().min(4).required(),
  nickname: Joi.string().min(2).pattern(new RegExp(nickname_pattern)).required(),
})
router.post("/signup", async (req, res) => {
  try {
    // const { nickname, email, password, confirmPassword } = req.body;
    console.log(req.body)
    // const { userId } = req.body.loginId;
    // const { password } = req.body.password;
    // const { nickname } = req.body.nickname;
    const { loginId, password, nickname } = await postUserSchema.validateAsync(req.body)

    // console.log(loginId);
    // console.log(userId);
    console.log(password)
    console.log(nickname)

    if (password.includes(loginId)) {
      res.send({
        ok: false,
        result: "비밀번호에 사용자의 아이디는 포함할 수 없습니다.",
      })
      return
    }
    const existUsers = await Users.find({
      $or: [{ userId: loginId }],
    })
    if (existUsers.length) {
      // userId 중복 데이터가 존재 할 경우
      res.send({
        ok: false,
        result: "중복된 닉네임입니다.",
      })
      return
    }

    const user = new Users({ userId: loginId, password, nickname })
    await user.save()
    res.send({
      ok: true,
      result: "회원가입을 축하드립니다.",
    })
  } catch (err) {
    let validationErrorMessage = "뭔가에러남"
    let JoiMessage = ""
    if (err.details) {
      JoiMessage = err.details[0].message // Joi 에서 발생하는 오류 메시지.
    }
    if (JoiMessage.includes("loginId")) {
      if (JoiMessage.includes("at least 3")) {
        // 아이디가 3글자 미만인 경우
        // JoiMessage : "userId" length must be at least 3 characters long
        validationErrorMessage = "아이디는 3글자 이상이어야 합니다."
      } else if (JoiMessage.includes("fails to match the required pattern")) {
        // 정규표현식 규칙에 맞지 않는 경우
        // JoiMessage : "userId" with value "나의아이디!" fails to match the required pattern: /^[a-z|A-Z|0-9]+$/
        validationErrorMessage = "아이디는 알파벳 대소문자, 숫자만 사용할 수 있습니다."
      }
    } else if (JoiMessage.includes("password")) {
      // 비밀번호가 4글자 미만인 경우
      // JoiMessage: "password" length must be at least 4 characters long
      validationErrorMessage = "비밀번호는 4글자 이상이어야 합니다."
    } else if (JoiMessage.includes("nickname")) {
      if (JoiMessage.includes("at least 2")) {
        // 닉네임이 2글자 미만인 경우
        // JoiMessage : "nickname" length must be at least 2 characters long
        validationErrorMessage = "닉네임은 2글자 이상이어야 합니다."
      } else if (JoiMessage.includes("fails to match the required pattern")) {
        // 정규표현식 규칙에 맞지 않는 경우
        // JoiMessage : "nickname" with value "나의닉네임!" fails to match the required pattern: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]+$/
        validationErrorMessage = "닉네임은 한글, 알파벳, 숫자만 사용할 수 있습니다."
      }
    } else {
      validationErrorMessage = "요청한 데이터 형식이 올바르지 않습니다."
    }
    console.log(err)
    // console.log(err.details[0].message);
    res.send({
      ok: false,
      result: validationErrorMessage,
    })
  }
})

/**
 * 로그인 API.
 * postLoginSchema 는 loginId, password에 대해 검사할 규칙을 사용.
 */
const postLoginSchema = Joi.object({
  loginId: Joi.string().min(3).required(),
  password: Joi.string().min(4).required(),
})

router.post("/login", async (req, res) => {
  try {
    const { loginId, password } = await postLoginSchema.validateAsync(req.body)

    const user = await Users.findOne({ userId: loginId, password }).exec()
    if (!user) {
      // request의 loginId, password 내용으로 일치하는 유저가 없는 경우
      res.send({
        ok: false,
        result: "닉네임 또는 패스워드를 확인해주세요.",
      })
      return
    }
    const token = jwt.sign({ userId: user.userId }, "MY-SECRET-KEY") // 토큰을 서버쪽에서 sign 하여 생성
    res.send({
      token, // 토큰 전달
    })
  } catch (err) {
    //
    res.send({
      ok: false,
      result: "닉네임 또는 패스워드를 확인해주세요2.",
    })
  }
})

/**
 * 내 정보 조회 API.
 * 사용자 인증 미들웨어. 경로와 function 사이에 미들웨어 변수를 불러와서 설정할 수 있다.
 */
router.get("/users/me", authMiddleware, async (req, res) => {
  // console.log(res.locals);
  // console.log(typeof(res.locals));
  /**
   * res.locals 내용 예시
   * [Object: null prototpye] { user: { _id: new ObjectId("61f39afc469383be12e78e81"), email: 'test@test.com', nickname: 'mynickname', password: '1234', __v: 0 }}
   */
  const { user } = res.locals // user object
  res.send({
    user: {
      userId: user.userId,
      nickname: user.nickname,
    },
  })
})

module.exports = router
