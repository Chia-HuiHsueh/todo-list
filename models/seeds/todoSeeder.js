const Todo = require('../todo') // 載入 todo model
const db = require('../../config/mongoose')

db.once('open', () => {
  //連線成功後新增資料
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: 'name-' + i })
  }
  console.log('done')
})