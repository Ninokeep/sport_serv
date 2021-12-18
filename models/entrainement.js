const { DataTypes} = require('sequelize');
const sequelize = require('../config/mysql');
const {Kine} = require('./kine');

const Entrainement = sequelize.define('entrainement', {
    nom : {
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
    commentaire : {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_kine : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Kine,
            key: 'id'
        }
    }

},
{
    engine : 'INNODB',
    freezeTableName : true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

module.exports = Entrainement;