'use strict';
module.exports = (sequelize, DataTypes) => {
  const CarScedule = sequelize.define('CarScedule', {
    car_id: DataTypes.INTEGER,
    start: DataTypes.TIME,
    end: DataTypes.TIME
  }, {});
  CarScedule.associate = function(models) {
    // CarScedule belongsTo car
    CarScedule.belongsTo(models.Car);
  };
  return CarScedule;
};