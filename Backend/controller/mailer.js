const nodemailer = require("nodemailer");

var password="jernmamlywxgtpyz"

exports.sendMail=(req, res, next)=>{
    var from="rogerthatvivek@gmail.com"
    var to=req.params.email
    var subject="Password Reset Link"
    var message="Here's your Password Reset Link"

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
        }
    })
}
