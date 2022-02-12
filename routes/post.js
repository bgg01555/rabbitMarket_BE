const express = require("express")
const router = express.Router()
const Post = require("../models/post")
const Comment = require("../models/comment")
const authMiddleware = require("../middlewares/auth-middleware")

//전체 상품 조회
router.get("/posts", async (req, res) => {
  let posts = await Post.find({})
  posts.sort(function (a, b) {
    return new Date(a.updatedAt) - new Date(b.updatedAt)
  })

  // for (let i = 0; i < posts.length; i++) {
  //     const comments_cnt = await Comment.count({ postId: posts[i]._id })
  //     posts[i].comments_cnt = comments_cnt;
  // }

  res.json({ ok: true, posts })
})

//상세 상품 조회
router.get("/posts/:postId", async function (req, res) {
  const { postId } = req.params

  Post.findById(postId, async function (err, post) {
    if (!err) {
      let comments = await Comment.find({ postId: postId })
      res.json({ ok: true, post, comments })
    } else {
      res.json({ ok: false, post: {}, comments: {} })
    }
  })
})

//판매 상품 등록
router.post("/posts", authMiddleware, async function (req, res) {
  const { title, price, imgurl, content } = req.body
  let { user } = res.locals

  //price number? string? 자동 변환 되는지

  if (title != "" && content != "" && price != "" && imgurl != "") {
    await Post.create({
      title,
      content,
      price,
      imgurl,
      isSold: false,
      userId: user.userId,
      nickname: user.nickname,
    })
    return res.json({ ok: true, result: "판매 상품이 등록되었습니다." })
  } else {
    return res.json({ ok: false, result: "올바른 입력이 아닙니다." })
  }
})

//판매 상품 수정
router.post("/posts", authMiddleware, async function (req, res) {
  const { title, price, imgurl, content } = req.body
  let { user } = res.locals

  //price number? string? 자동 변환 되는지

  if (title != "" && content != "" && price != "" && imgurl != "") {
    await Post.updateOne(
      {},
      {
        title,
        content,
        price,
        imgurl,
        isSold: false,
        userId: user.userId,
        nickname: user.nickname,
      }
    )
    return res.json({ ok: true, result: "판매 상품이 등록되었습니다." })
  } else {
    return res.json({ ok: false, result: "올바른 입력이 아닙니다." })
  }
})

// //판매 상품 등록
// router.post("/posts", authMiddleware, function (req, res) {
//     const { title, price, imgurl, content } = req.body;
//     let { user } = res.locals;

//     //price number? string? 자동 변환 되는지

//     if (title != '' && content != '' && price != '' && imgurl != '') {
//         await Post.create({
//             title, content, price, imgurl, isSold: false,
//             userId: user.userId, nickname: user.nickname
//         });
//         return res.json({ ok: true, result: '판매 상품이 등록되었습니다.' });
//     }
//     else {
//         return res.json({ ok: false, result: '올바른 입력이 아닙니다.' });
//     }

// });

module.exports = router
