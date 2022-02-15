const mongoose = require("mongoose")
require("dotenv").config()

// ec2 데이터베이스
const connect = () => {
  mongoose
    .connect(process.env.MONGOOSE_DB, {
      ignoreUndefined: true,
    })
    .catch((err) => {
      console.error(err)
    })
}

module.exports = connect
