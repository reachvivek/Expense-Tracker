const Expenses=require('../model/expenses')
const ITEMS_PER_PAGE=3
exports.showServer=(req, res, next)=>{
    res.send("<h1>Welcome to Expense Tracker's Backend Server</h1>")
}

exports.getExpenses=async(req, res, next)=>{
    var totalExpenses;
    const page = +req.params.pageNo || 1;
    let totalItems=Expenses.findAll({where: {userId: req.user.id}}).then(response=>{
        totalExpenses=response.length
    }).catch(err=>console.log(err))

    await totalItems;

    Expenses.findAll({where: {userId: req.user.id}, offset: (page-1)*ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE})
    .then(response=>{
        res.status(200).send({
            response: response,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalExpenses,
            hasPreviousPage: page > 1,
            nextPage:page+1,
            previousPage:page-1,
            lastPage:Math.ceil(totalExpenses/ITEMS_PER_PAGE),
            totalItems: totalExpenses
        });
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
        res.status(200).send(JSON.stringify(expenses))
    }).catch(err=>console.log(err))
}