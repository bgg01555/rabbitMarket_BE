const mongoose = require("mongoose")
//const Comment = require('../schemas/comment');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imgurl: {
    type: String,
    required: true,
  },
  isSold: {
    type: Boolean,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },

  // date: {
  //     type: String,
  //     required: true,
  // },

  timestamps: true, // createdAt, updatedAt 으로 Date형 객체 입력
})

PostSchema.virtual("postId").get(function () {
  return this._id.toHexString()
})

PostSchema.set("toJSON", {
  virtuals: true,
})

// PostSchema.pre(
//     "deleteOne", { document: false, query: true },
//     async function (next) {
//         // post id
//         const { _id } = this.getFilter();

//         // 관련 댓글 삭제
//         await Comment.deleteMany({ articleId: _id });
//         next();
//     }
// );

module.exports = mongoose.model("Posts", PostSchema)
