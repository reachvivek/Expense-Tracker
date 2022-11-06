const nodemailer = require("nodemailer");
const ForgotPassword=require('../model/forgotPassword')
const Users=require('../model/users')
const { v4: uuidv4 } = require('uuid');
const url="http://localhost:4000/resetPassword/"
const bcrypt = require('bcrypt');
const saltRounds = 10;

var password="jernmamlywxgtpyz"

exports.sendMail=(req, res, next)=>{
    const id=uuidv4()
    ForgotPassword.create({
        id:id,
        email:req.params.email,
        isActive:true
    }).then(response=>{
        var from="rogerthatvivek@gmail.com"
        var to=req.params.email
        var subject="Password Reset Link"
        var message=`Here's your Password Reset Link:${url}${id}`

        var transporter=nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user:from,
                pass:password
            }
        });
        var mailOptions={
            from: from,
            to: to,
            subject: subject,
            text: message
        };

        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err)
            }
            else{
                res.status(200).send({info:info.response, sent:true})
                console.log(info)
            }
        })
    })
}

exports.resetPassword=(req, res, next)=>{
    const uuid=req.params.uuid
    ForgotPassword.findOne({where: {id:uuid, isActive:true}})
    .then(entry=>{
        console.log(entry)
        if (entry){
            res.sendFile('/views/reset.html', {root: __dirname })
        }else{
            res.redirect(`https://expense-tracker-nodejs-app.herokuapp.com/`)
        }
    })
}

exports.updatePassword=(req, res, next)=>{
    var uuid=(req.params.uuid)
    ForgotPassword.findOne({where: {id:uuid, isActive:true}}).then(entry=>{
        if (entry){
            entry.isActive=false
            entry.save()
            Users.findOne({where:{email:entry.email}}).then(user=>{
                bcrypt.hash(req.body.password, saltRounds).then((hash)=>{
                    user.password=hash
                    user.save()
                    console.log('Password Updated!')
                }).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }else{
            console.log(entry)
        }
    }).catch(err=>console.log(err))
}