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