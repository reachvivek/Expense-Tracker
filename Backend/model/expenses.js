const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Expenses=sequelize.define('expenses', {
    id:{
        type: Sequelize.INTEGER,
        allowedNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    amount:{
        type: Sequelize.FLOAT,
        allowedNull:false
    },
    desc:{
        type: Sequelize.TEXT,
        allowedNull: false
    },
    catg:{
        type:Sequelize.STRING,
        allowedNull:false
    }
})

module.exports=Expenses;