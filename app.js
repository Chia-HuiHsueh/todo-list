const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo')

const app = express()
const port = 3000

//新增了一個叫 hbs 的樣板引擎，並傳入exphbs相關的參數
//extname: '.hbs'->指定副檔名為 .hbs
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

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
// 設定路由
// Todo 首頁
app.get('/', (req, res) => {
  Todo.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列//撈資料以後想用 res.render()，要先用 .lean() 來處理
    .then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

app.listen(port, () => {
  console.log('App is running on http://localhost：3000')
})
