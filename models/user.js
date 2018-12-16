'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    tag: DataTypes.STRING,
  }, {});
  User.associate = function(models) {
    // user hasMany cars
    User.hasMany(models.Car,{foreignKey:'user_id'});
  };
  return User;
};