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

// const connect = () => {
//   mongoose.connect(
//     "mongodb://localhost:27017/rabbitmarket11",
//     { ignoreUndefined: true },
//     (error) => {
//       if (error) {
//         console.log("mongodb error", error)
//       } else {
//         console.log("connected")
//       }
//     }
//   )
// }

module.exports = connect
