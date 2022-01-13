const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");
const Session = require('./session');
const SessionMeta = sequelize.define(
  "session_meta",
  {
    meta_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta_value: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    id_session : {
      type: DataTypes.INTEGER,
      references: {
        model: Session,
        key: 'id'
      }
    },
  },
  {
    engine: "INNODB",
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = SessionMeta;
