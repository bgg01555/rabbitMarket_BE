const mongoose = require("mongoose")

const commentsSchema = new mongoose.Schema({
  //   commentId: {
  //     type: String,
  //     unique: true,
  //     required: true,
  //   },
  comment: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  // createdAt, updatedAt 으로 Date형 객체 입력
}, { timestamps: true, })

commentsSchema.virtual('commentId').get(function () {
  return this._id.toHexString();
});
commentsSchema.set('toJSON', {
  virtuals: true,
});

const Comments = mongoose.model("Comments", commentsSchema)
module.exports = Comments
