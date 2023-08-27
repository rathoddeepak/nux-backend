const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Streams', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hubId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hubs',
        key: 'id'
      },
      field: 'hub_id'
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rtspUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rtsp_url'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    },
    relativeOrder: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 1,
      field: 'relative_order'
    }
  }, {
    sequelize,
    tableName: 'streams',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "streams_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
