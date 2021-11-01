
const { DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');

const SportifEntrainement = sequelize.define('SportifEntrainement', 
{
 
},
{engine:'INNODB'});


module.exports = SportifEntrainement;