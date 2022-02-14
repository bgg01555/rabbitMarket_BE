const mongoose = require("mongoose")
const { post } = require("../routes/upload")
//const Comment = require('../schemas/comment');
const Users = require("./user")

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
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
    userId: {
      type: String,
      required: true,
    },
  },
  // date: {
  //     type: String,
  //     required: true,
  // },

  { timestamps: true } // createdAt, updatedAt 으로 Date형 객체 입력
)

PostSchema.virtual("postId").get(function () {
  return this._id.toHexString()
})

PostSchema.set("toJSON", {
  virtuals: true,
})

//console.log(req.file)
//console.log(req.file.location)

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
