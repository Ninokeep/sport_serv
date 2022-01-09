const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const SessionMeta = sequelize.define(
  "session_meta",
  {
    meta_session: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta_value: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    id_session: {
      type: DataTypes.NUMBER,
      allowNull: false,
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

module.exports = SessionMeta;
