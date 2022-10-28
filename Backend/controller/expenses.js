const Expenses=require('../model/expenses')
const fs=require('fs')
exports.showServer=(req, res, next)=>{
    res.send("<h1>Welcome to Expense Tracker's Backend Server</h1>")
}

exports.getExpenses=(req, res, next)=>{
    Expenses.findAll({where: {userId: req.user.id}}).then(response=>{
        res.status(200).send(response)
    })
}

exports.getExpense=(req, res, next)=>{
    Expenses.findByPk(req.params.id).then(response=>{
        res.status(200).send(response)
    }).catch(err=>console.log(err))
}

exports.addExpense=(req, res, next)=>{
    Expenses.create({
        amount: req.body.amount,
        desc: req.body.desc,
        catg: req.body.catg,
        userId: req.user.id
    }).then(response=>{
        res.status(201).send(response)
    }).catch(err=>console.log(err))
}

exports.deleteExpense=(req, res, next)=>{
    Expenses.findByPk(req.params.id).then(response=>{
        return response.destroy()
    }).catch(err=>console.log(err)).then(response=>{
        res.status(200).send({
            response:response
        })
    }).catch(err=>console.log(err))
}

exports.editExpense=(req, res, next)=>{
    Expenses.findByPk(req.params.id).then(response=>{
        response.id=req.params.id
        response.amount=req.body.amount
        response.desc=req.body.desc
        response.catg=req.body.catg
        return response.save()
    }).catch(err=>console.log(err)).then(response=>{
        res.status(200).send({
            response:response
        })
    }).catch(err=>console.log(err))
}

exports.downloadExpenses=(req,res,next)=>{
    Expenses.findAll({where: {userId:req.user.id}}).then(expenses=>{
        fs.writeFile("expenses.txt", JSON.stringify(expenses), (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              console.log(fs.readFileSync("expenses.txt", "utf8"));
            }
        });
        const file=`${__dirname}/expenses.txt`
        res.status(200).send(JSON.stringify(expenses))
    }).catch(err=>console.log(err))
}