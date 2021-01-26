const express = require('express')

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


const routes = require('./routes')
//對 app.js 而言，Mongoose 連線設定只需要「被執行」，不需要接到任何回傳參數繼續利用，所以這裡不需要再設定變數。
require('./config/mongoose')

const app = express()

const port = 3000


//新增了一個叫 hbs 的樣板引擎，並傳入exphbs相關的參數
//extname: '.hbs'->指定副檔名為 .hbs
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

// 將 request 導入路由器
app.use(routes)

app.listen(port, () => {
  console.log('App is running on http://localhost：3000')
})
