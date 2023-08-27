const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Frames', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    streamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'streams',
        key: 'id'
      },
      field: 'stream_id'
    },
    grNote: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'gr_note'
    },
    width: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    height: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    objects: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'frames',
    schema: 'public',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "frames_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
