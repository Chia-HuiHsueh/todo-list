const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String, 
    required: true 
  },
  isDone: {
    //通常變數名稱用 is，暗示著這個變數的型別為布林值
    type: Boolean,
    default: false, 
  },
  userId: {  
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Todo', todoSchema)