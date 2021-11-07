
const { DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');

const SportifEntrainement = sequelize.define('SportifEntrainement', 
{
    finished: {
        type : DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
},
{engine:'INNODB'});


module.exports = SportifEntrainement;