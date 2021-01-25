const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

router.get('/new', (req, res) => {
  return res.render('new')
})
//新增資料
router.post('/', (req, res) => {

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

//查詢資料：路由使用動態參數
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) //從資料庫撈資料
    .lean() //過濾資料轉換成單純的JS物件
    .then((todo) => res.render('detail', { todo }))//資料傳送到前端面板
    .catch(error => console.log(error))
})

//顯示單筆資料可編輯內容
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

//提交更新內容
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  // const name = req.body.name 
  // const isDone = req.body.isDone
  return Todo.findById(id)
    .then(todo => {
      todo.name = name //把原來todo資料改成新的
      todo.isDone = isDone === 'on'
      //運算子優先序
      //優先執行isDone === 'on'//回傳'on'
      //再執行賦值運算子//todo.isDone =true

      // if (isDone === 'on') {
      //   todo.isDone = true
      // } else {
      //   todo.isDone = false
      // }
      return todo.save()//存進資料庫
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

//delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
module.exports = router