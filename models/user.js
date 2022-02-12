const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  // createdAt, updatedAt 으로 Date형 객체 입력
}, { timestamps: true, })

module.exports = mongoose.model("Users", userSchema)
