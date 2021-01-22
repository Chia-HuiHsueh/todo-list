const mongoose = require('mongoose')
//schema資料庫綱要
const Schema = mongoose.Schema
//把想要的資料結構當成參數傳給 new Schema()
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  }
})
//透過 module.exports 把這個 schema 輸出
module.exports = mongoose.model('Todo', todoSchema)