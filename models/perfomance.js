const { DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');


const Perfomance = sequelize.define('Perfomance', {
    vitesse : {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    temps : { //en seconde
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    distance : {
        type: DataTypes.SMALLINT,
        allowNull: false
    },

},
{
    engine: 'INNODB'
})

module.exports = Perfomance;