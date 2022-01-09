const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Patient = require('./patient');
const Session = sequelize.define(
  "session",
  {
    id:{ 
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    id_entrainement: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    fini: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    message_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    repetition_fait: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    id_user : {
      type: DataTypes.INTEGER,
      references: {
        model: Patient,
        key: 'id'
      }
    }
  },
  {
    engine: "INNODB",
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Session;
