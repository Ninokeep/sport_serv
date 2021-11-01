const { DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');


const Agenda = sequelize.define('Agenda', {
    // entrainement_id
    fini : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    commentaire : {
        type: DataTypes.STRING,
        allowNull: true
    },
    appreciation : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
},
{
    engine: 'INNODB'
})

module.exports = Agenda;