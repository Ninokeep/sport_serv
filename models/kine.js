const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');



const Kine = sequelize.define('kine', {



    nom : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom : {
        type: DataTypes.STRING,
        allowNull: false
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    },
    

    // token : {
    // type : DataTypes.STRING,
    // allowNull: true,
    // defaultValue: null
    // }
    },
    {
        engine : 'INNODB',
        freezeTableName : true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },
  


)



module.exports = Kine;