const express=require('express')
const cors=require('cors')
const helmet=require('helmet')
const bodyParser=require('body-parser')
const app=express();

const mongoose=require('mongoose');

const uri='mongodb+srv://admin:Ebk8r1r6Aa1ZFlbn@expense-tracker.3umwxfw.mongodb.net/expense-tracker?retryWrites=true&w=majority'

const expensesRoutes=require('./routes/expenses');
const authRoutes=require('./routes/users');

app.use(cors())
app.use(helmet())

app.use(bodyParser.json({extended:false}))
app.use(bodyParser.urlencoded({extended:false}))

app.use(expensesRoutes)
app.use(authRoutes)

mongoose.connect(uri)
.then(result=>{
    app.listen(process.env.PORT || 4000, ()=>{
        console.log("Server started running on Port: 4000")
    })
})