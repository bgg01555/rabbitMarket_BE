const mongoose = require("mongoose")

// ec2 데이터베이스
const connect = () => {
  mongoose
    .connect("mongodb://test:test@52.79.160.167:27017/rabbitMarket?authSource=admin", {
      ignoreUndefined: true,
    })
    .catch((err) => {
      console.error(err)
    })
}
module.exports = connect
