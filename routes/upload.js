const AWS = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")
const express = require("express")
const router = express.Router()
const path = require("path")
const Posts = require("../models/post")
require("dotenv").config()

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
})



const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "rabbitmarket",
    acl: "public-read",
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
