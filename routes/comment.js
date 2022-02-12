const express = require("express")
const router = express.Router()
const Comments = require("../models/comment")
const authMiddleware = require("./middlewares/auth-middleware")
const Posts = require("../models/post")

router.post("/comments", async (req, res) => {
  try {
    const comments = await new Comments({
      comment,
    })
    const result = await comments.save()
    console.log(result)
    res.json(result)
  } catch (e) {
    console.log(e)
    res.send({
      ok: false,
      result: "댓글 작성에 실패했습니다",
    })
  }
})

module.exports = router
