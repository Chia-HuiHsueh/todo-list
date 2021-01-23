const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Todo = require('./models/todo')

const app = express()

const port = 3000

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

//新增了一個叫 hbs 的樣板引擎，並傳入exphbs相關的參數
//extname: '.hbs'->指定副檔名為 .hbs
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定路由
// Todo 首頁
app.get('/', (req, res) => {
  Todo.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列//撈資料以後想用 res.render()，要先用 .lean() 來處理
    .then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
app.get('/todos/new', (req, res) => {
  return res.render('new')
})
app.post('/todos', (req, res) => {

  //方法一：直接操作資料庫
  const name = req.body.name    // 從 req.body 拿出表單裡的 name 資料   
  return Todo.create({ name })     // 呼叫 Todo物件直接新增資料並存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))

  //方法二：先產生物件實例,再把實例存入Todo

  // const name = req.body.name 
  // const todo = new Todo({name})//從Todo產生一個實例
  // return todo.save()//將實例存入資料庫
  // .then(()=>res.redirect('/'))
  // .catch(error => console.log(error))

})
//路由使用動態參數
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) //從資料庫撈資料
    .lean() //過濾資料轉換成單純的JS物件
    .then((todo) => res.render('detail', { todo }))//資料傳送到前端面板
    .catch(error => console.log(error))
})
//顯示單筆資料可編輯內容
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})
//提交更新內容
app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name //新修改好的資料
  return Todo.findById(id)
    .then(todo => {
      todo.name = name //把原來todo資料改成新的
      return todo.save()//存
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})
app.listen(port, () => {
  console.log('App is running on http://localhost：3000')
})
