var DataTypes = require("sequelize").DataTypes;
var _Frames = require("./Frames");
var _Hubs = require("./Hubs");
var _Stations = require("./Stations");
var _Streams = require("./Streams");

function initModels(sequelize) {
  var Frames = _Frames(sequelize, DataTypes);
  var Hubs = _Hubs(sequelize, DataTypes);
  var Stations = _Stations(sequelize, DataTypes);
  var Streams = _Streams(sequelize, DataTypes);

  Streams.belongsTo(Hubs, { as: "hub", foreignKey: "hubId"});
  Hubs.hasMany(Streams, { as: "streams", foreignKey: "hubId"});
  Hubs.belongsTo(Stations, { as: "station", foreignKey: "stationId"});
  Stations.hasMany(Hubs, { as: "hubs", foreignKey: "stationId"});
  Frames.belongsTo(Streams, { as: "stream", foreignKey: "streamId"});
  Streams.hasMany(Frames, { as: "frames", foreignKey: "streamId"});

  return {
    Frames,
    Hubs,
    Stations,
    Streams,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
