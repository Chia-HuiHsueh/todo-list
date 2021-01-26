const mongoose = require('mongoose')
// 設定連線到 mongoDB
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection

// 連線異常
//db.on()：在這裡用 on 註冊一個事件監聽器，用來監聽 error 事件有沒有發生
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
//db.once() - 針對「連線成功」的 open 情況，我們也註冊了一個事件監聽器，連線成功只會發生一次，所以這裡特地使用 once，由 once 設定的監聽器是一次性的，一旦連線成功，在執行 callback 以後就會解除監聽器。
db.once('open', () => {
  console.log('mongodb connected!')
})
module.exports = db
