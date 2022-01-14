const { DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');
const {Kine} = require('./kine');

const Entrainement = sequelize.define('entrainement', {
    nom : {
        type: DataTypes.STRING,
        allowNull: false
    },
  
    cote: {
        type: DataTypes.STRING,
        allowNull: false
    },
 
    gif : {
        type  : DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    niveau: {
        type : DataTypes.STRING,
        validate: {
            isIn: [['debutant','intermediaire','expert']]
        },
        allowNull: false,
        
    },
 
    

},
{
    engine : 'INNODB',
    freezeTableName : true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

module.exports = Entrainement;