const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const ForgotPassword=sequelize.define('forgotPassword', {
    id:{
        type: Sequelize.STRING,
        allowedNull: false,
        primaryKey: true
    },
    email:{
        type: Sequelize.STRING,
        allowedNull: false
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        allowedNull:false
    }
})

module.exports=ForgotPassword;