const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express();
const sequelize=require('./util/database')
const Users=require('./model/users')
const Expenses=require('./model/expenses')
const expensesRoutes=require('./routes/expenses');
const authRoutes=require('./routes/users');

app.use(cors())

app.use(bodyParser.json({extended:false}))

app.use(bodyParser.urlencoded({extended:false}))

Users.hasMany(Expenses)
Expenses.belongsTo(Users)

app.use(expensesRoutes)
app.use(authRoutes)

sequelize.sync().then(response=>{
    console.log(response)
    app.listen(4000, ()=>console.log("Server started running on Port: 4000"))
}).catch(err=>console.log(err))
