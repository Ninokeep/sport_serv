const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');



const User = sequelize.define('user', {



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
    sexe : {
        // 0 = men and 1 = girl
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    token : {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    rule : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    age : {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
        
    },
    numero_telephone : {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pathologie : {
        type: DataTypes.STRING,
        allowNull: false
    },
    seance_restante : {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
    },
    id_kine : {
    type : DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
    }
    },
    {
        engine : 'INNODB',
        freezeTableName : true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },
  


)



module.exports = User;