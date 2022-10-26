const Expenses=require('../model/expenses')

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
