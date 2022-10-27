const Users=require('../model/users')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function generateToken(email){
    return (jwt.sign({email:email}, 'expenseTrackerToken'))
}

exports.createUser=(req, res, next)=>{
    console.log(req.body)
    bcrypt.hash(req.body.password, saltRounds).then((hash)=>{
        console.log(hash)
        Users.findOrCreate({
            where: {email:req.body.email},
            defaults: {
                name: req.body.name,
                password: hash,
                isPremium: false
        }}).then(response=>{
            res.status(201).send(response)
        }).catch(err=>console.log(err))
    });
}

exports.findUser=(req, res, next)=>{
    const creds=JSON.parse(req.params.creds)
    Users.findOne({where: {email:creds.email}})
    .then(response=>{
        if (response==null || response==''){
            res.status(200).send({code:0})
        }else{
            bcrypt.compare(creds.password, response.password).then((result)=>{
                if(result){
                    res.status(200).send({code:1, token:generateToken(creds.email)})
                }else{
                    res.status(200).send({code:2})
                }
            });
        }
    }).catch(err=>console.log(err))
}

exports.updateUser=(req, res, next)=>{
    Users.findOne({where: {email:req.user.email}}).then(user=>{
        user.isPremium=true
        return user.save()
    }).catch(err=>console.log(err)).then(response=>{
        res.status(200).send(response.isPremium)
    }).catch(err=>console.log(err))
}

exports.isPremium=(req, res, next)=>{
    console.log(req.user)
    if(req.user.isPremium){
        res.status(200).send({isPremium:req.user.isPremium})
    }else{
        res.status(200).send({isPremium:req.user.isPremium})
    }
}