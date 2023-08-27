const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Hubs', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'stations',
        key: 'id'
      },
      field: 'station_id'
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    },
    layout: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    classes: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'hubs',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "hubs_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
