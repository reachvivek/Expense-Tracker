const express=require('express')
const bodyParser=require('body-parser')
const app=express();
const sequelize=require('./util/database')

const routes=require('./routes/expenses');

app.use(bodyParser.json({extended:false}))

app.use(routes)

sequelize.sync().then(response=>{
    console.log(response)
    app.listen(3000, ()=>console.log("Server started running on Port: 3000"))
}).catch(err=>console.log(err))
