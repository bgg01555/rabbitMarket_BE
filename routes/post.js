const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Comment = require("../models/comment");


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

    res.json({ ok: true, posts });
})

//상세 상품 조회
router.get("/posts/:postId", async function (req, res) {
    const { postId } = req.params;

    Post.findById(postId, async function (err, post) {
        if (!err) {
            let comments = await Comment.find({ postId: postId });
            res.json({ ok: true, post, comments });
        } else {
            res.json({ ok: false, post: {}, comments: {} });
        }
    });
});


//상세 상품 등록
router.post("/posts", function (req, res) {
    const { token, title, price, image_url, content } = req.body;


    //비로그인 전체조회 맞고
    //닉네임도 중복체크 해야되는데..
    //닉네임은 중복체크 어떻게??

    //게시글 작성
    //price number? string? 자동 변환 되는지
    if (title != '' && contents != '' && price != '' && image_url != '') {
        await Post.create({ title, content, price, image_url });
        return res.json({ ok: false, msg: '작성 완료' });
    }
    else {
        return res.status(400).json({ success: false, msg: '빈칸 없이 입력하세요' });
    }



    Post.findById(postId, async function (err, post) {
        if (!err) {
            let comments = await Comment.find({ postId: postId });
            res.json({ ok: true, post, comments });
        } else {
            res.json({ ok: false, post: {}, comments: {} });
        }
    });
});


module.exports = router;