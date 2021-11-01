const { DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');


const Entrainement = sequelize.define('Entrainement', {
    nom : {
        type: DataTypes.STRING,
        allowNull: false
    },
    commentaire : {
        type: DataTypes.STRING,
        allowNull: false
    },

    objectif : {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating : {
        type  : DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    niveau: {
        type : DataTypes.STRING,
        allowNull: false,
        defaultValue: 'débutant'
    }
    //entraineur ID
    // perfomance ID
},
{
    engine : 'INNODB'
})

module.exports = Entrainement;