const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const DownloadHistory=sequelize.define('downloadhistory', {
    id:{
        type: Sequelize.INTEGER,
        allowedNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    link:{
        type: Sequelize.TEXT,
        allowedNull:false
    },
    userId:{
        type: Sequelize.STRING,
        allowedNull: false
    }
})

module.exports=DownloadHistory;