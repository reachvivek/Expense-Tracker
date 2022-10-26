const Users=require('../model/users')

exports.createUser=(req, res, next)=>{
    Users.findOrCreate({
        where: {email:req.body.email},
        defaults: {
            name: req.body.name,
            password: req.body.password
    }}).then(response=>{
        res.status(201).send(response)
    }).catch(err=>console.log(err))
}

exports.findUser=(req, res, next)=>{
    console.log(req.params.email)
    Users.findOne({where: {email:req.params.email}}).then(response=>{
        res.status(200).send(response)
    }).catch(err=>console.log(err))
}