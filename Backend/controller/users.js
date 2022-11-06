const User=require('../model/users')
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
        User.findOne({'email':req.body.email})
        .then(response=>{
            if (!response){
                const user=new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    isPremium: false 
                })
                user.save().then(result=>{
                    res.status(201).send(result)
                })
            }
            else{
                res.status(201).send([response, false])
            }
        })
    });
}

exports.findUser=(req, res, next)=>{
    const creds=JSON.parse(req.params.creds)
    User.findOne({'email': creds.email})
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
    User.findOne({'email':req.user.email}).then(user=>{
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