const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const authMiddleware = require('../middlewares/auth-middleware');

//전체 상품 조회
router.get("/posts", async (req, res) => {
    let posts = await Post.find({});
    posts.sort(function (a, b) {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
    });
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
            comments.sort(function (a, b) {
                return b.updatedAt - a.updatedAt;
            });
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
router.put("/posts", authMiddleware, async function (req, res) {
    const { title, price, imgurl, content, postId } = req.body;
    let { user } = res.locals;

    //price number? string? 자동 변환 되는지
    if (title != '' && content != '' && price != '' && imgurl != '') {
        const existsPost = await Post.findById(postId);
        if (user.userId === existsPost.userId) {
            await Post.updateOne({ _id: postId }, {
                $set: {
                    title, content, price, imgurl, isSold: false,
                    userId: user.userId, nickname: user.nickname
                }
            });
            return res.json({ ok: true, result: '판매 상품이 수정되었습니다.' });
        }
        else return res.json({ ok: false, result: '수정 권한이 없습니다.' });
    }
    else {
        return res.json({ ok: false, result: '올바른 입력이 아닙니다.' });
    }
});

//판매 상품 삭제
router.delete("/posts", authMiddleware, async (req, res) => {
    const { postId } = req.body;
    const existsPost = await Post.findById(postId);
    const { user } = res.locals;

    if (existsPost.userId === user.userId) {
        await Post.deleteOne({ _id: postId });
        return res.json({ ok: true, result: "판매 상품이 삭제되었습니다." });
    }

    return res.json({ ok: false, result: "삭제 권한이 없습니다." });
})


//판매중-판매완료 상태수정
router.patch("/status", authMiddleware, async function (req, res) {
    const { postId } = req.body;
    let { user } = res.locals;

    let post = await Post.findById(postId);
    if (post.userId === user.userId) {
        await Post.updateOne(
            { _id: postId },
            {
                $set: {
                    isSold: !post.isSold
                }
            }
        )
        if (!post.isSold) {
            return res.json({ ok: true, result: '판매완료로 변경 되었습니다.' });
        }
        else {
            return res.json({ ok: true, result: '판매중으로 변경 되었습니다.' });
        }
    }
    else {
        return res.json({ ok: false, result: '권한이 없습니다.' });
    }
});


module.exports = router;
