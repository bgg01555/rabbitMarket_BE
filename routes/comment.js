const express = require("express")
const router = express.Router()
const Comments = require("../models/comment")
const authMiddleware = require("../middlewares/auth-middleware")
//const Posts = require("../models/post")

//댓글 작성
router.post("/comments", authMiddleware, async (req, res) => {
  console.log(res.locals)
  const { postId, comment, nickname, userId } = req.body
  const comments = await new Comments({
    comment,
    nickname,
    postId,
    userId,
  })
  try {
    const result = await comments.save()
    res.send({ ok: true, result })
  } catch (e) {
    console.log(e)
    res.send({
      ok: false,
      result: "댓글 작성에 실패했습니다",
    })
  }
})

//댓글 삭제
router.delete("/comments", authMiddleware, async (req, res) => {
  const { commentId } = req.body
  try {
    const comment = await Comments.findByIdAndDelete(commentId)

    if (!comment) {
      return res.status(404).send({
        ok: false,
        result: "댓글 삭제에 실패했습니다",
      })
    }
    res.status(200).send({ ok: true, comment })
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

module.exports = router
