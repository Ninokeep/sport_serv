const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');



const Sportif = sequelize.define('Sportif', {
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
    sport : {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'course'
    },
    poids : {
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'sportif'
    } 
  
},
{
    engine : 'INNODB'
}



)



module.exports = Sportif;