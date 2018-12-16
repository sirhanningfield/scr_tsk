'use strict';
module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    user_id: DataTypes.INTEGER,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    year: DataTypes.INTEGER,
    featured: DataTypes.BOOLEAN,
    price: DataTypes.FLOAT,
    status: DataTypes.BOOLEAN,
    
  }, {});
  Car.associate = function(models) {
    // car belongsTo a user
    Car.belongsTo(models.User,{foreignKey : 'user_id'});
    
    // car hasMany carSchedules
    Car.hasMany(models.CarScedule, {foreignKey : 'car_id'});
  };
  return Car;
};