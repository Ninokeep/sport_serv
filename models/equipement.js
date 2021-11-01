const { DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');



const Equipement = sequelize.define('Entrainement',{
    
    nom : {
        type : DataTypes.STRING,
        allowNull: false
    },
    km :{
        type : DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    },
    photo : {
        type: DataTypes.BLOB,
        allowNull: true
    }

},
{
    engine : 'INNODB'
});

module.exports = Equipement;