const AWS = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")
const express = require("express")
const router = express.Router()
const path = require("path")
const Posts = require("../models/post")

const s3 = new AWS.S3({
  accessKeyId: "AKIARVRW75BRKUUXQSPH",
  secretAccessKey: "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",
  region: "ap-northeast-2",
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "rabbitmarket",
    acl: "bucket-owner-full-control",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(
        null,
        Math.floor(Math.random() * 1000).toString() +
          Date.now() +
          "." +
          file.originalname.split(".").pop()
      )
    },
  }),
  limits: { fileSize: 1000 * 1000 * 10 },
})

exports.upload = multer(upload)
