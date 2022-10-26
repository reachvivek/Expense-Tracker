const Users=require('../model/users')
const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.createUser=(req, res, next)=>{
    console.log(req.body)
    bcrypt.hash(req.body.password, saltRounds).then((hash)=>{
        console.log(hash)
        Users.findOrCreate({
            where: {email:req.body.email},
            defaults: {
                name: req.body.name,
                password: hash
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
                    res.status(200).send({code:1})
                }else{
                    res.status(200).send({code:2})
                }
            });
        }
    }).catch(err=>console.log(err))
}