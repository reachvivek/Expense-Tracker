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
    console.log(req.params.creds)
    const creds=JSON.parse(req.params.creds)
    console.log(typeof(creds))
    Users.findOne({where: {email:creds.email}})
    .then(response=>{
        if (response==null || response==''){
            res.status(200).send({code:0})
        }else if(response.password==creds.password){
            res.status(200).send({code:1})
        }else{
            res.status(200).send({code:2})
        }
        res.status(200).send(response)
    }).catch(err=>console.log(err))
}