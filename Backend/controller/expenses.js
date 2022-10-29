require('dotenv').config()
const Expenses=require('../model/expenses')
const Users = require('../model/users')
const DownloadHistory=require('../model/downloadHistory')
const AWS=require('aws-sdk')

var ITEMS_PER_PAGE=3

exports.showServer=(req, res, next)=>{
    res.send("<h1>Welcome to Expense Tracker's Backend Server</h1>")
}

exports.updatePages=(req,res,next)=>{
    console.log(req.params.pages)
    ITEMS_PER_PAGE=parseInt(req.params.pages)
    res.status(200).send({updated:true})
}

exports.getExpenses=async(req, res, next)=>{
    var totalExpenses;
    let positive=0.00, negative=0.00;
    const page = +req.params.pageNo || 1;
    let totalItems=Expenses.findAll({where: {userId: req.user.id}}).then(response=>{
        totalExpenses=response.length
        response.map(i=>{
            (i.amount>0)?positive+=i.amount:negative+=i.amount;
        })
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
            positive:positive,
            negative:negative,
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


function uploadToS3(data, filename){
    let s3bucket= new AWS.S3({
        accessKeyId:process.env.AWS_ACCESS_ID,
        secretAccessKey:process.env.AWS_KEY
    })
    var params={
        Bucket:process.env.BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    return new Promise((resolve, reject)=>{
        s3bucket.upload(params, (err, s3response)=>{
            if(err){
                reject(err)
            }else{
                console.log(s3response)
                resolve(s3response.Location) 
            }
        })
    })
}

exports.downloadExpenses=async(req,res,next)=>{
    const expenses=await Expenses.findAll({where: {userId:req.user.id}})
    const stringifiedExpenses=JSON.stringify(expenses);
    const filename=`Expense${req.user.id}/${new Date()}.txt`
    const fileURL=await uploadToS3(stringifiedExpenses, filename)
    res.status(200).send(fileURL)
    DownloadHistory.create({
        link:fileURL,
        userId:req.user.id
    }).catch(err=>console.log(err))
}

exports.showHistory=(req, res, next)=>{
    DownloadHistory.findAll({where: {userId:String(req.user.id)}}).then(history=>{
        res.status(200).send(history)
    }).catch(err=>console.log(err))
}


exports.leaderboard=(req, res, next)=>{
    Users.findAll().then(users=>{
        const allUsers=[]
        users.map(user=>allUsers.push({id:user.id,name:user.name}))
        Expenses.findAll().then(expenses=>{
            const allExpenses=expenses
            res.status(200).send({users:allUsers, expenses:allExpenses})
        })
    }).catch(err=>console.log(err))
}