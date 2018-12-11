'use strict';
module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    user_id: DataTypes.INTEGER,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    year: DataTypes.INTEGER,
    
  }, {});
  Car.associate = function(models) {
    // car belongsTo a user
    Car.belongsTo(models.User);
    
  };
  return Car;
};