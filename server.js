require("dotenv").config()
const expres = require('express')
const mongoose=require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')





const app=expres()
app.use(expres.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
   
}))

// routers
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))




//mongodb connection
const URI = process.env.MONGO_URL
mongoose.connect(URI,{
  
}, err=>{
    if(err) throw err;
    console.log("connected to mongodb");

})

app.get('/',(req,res)=>{
    res.json({msg: "this is original amazon"})
})

const PORT = process.env.PORT || 9000
app.listen(PORT,()=>{
    console.log("server is running on port",PORT);
})