const bcrpyt = require('bcrypt');
const db = require('../models');
const config = require('../config/env');
const jwt = require('jsonwebtoken');


exports.getUsers = function(req, res){
    var query = "SELECT name, email, tag FROM users";
    var replacements = {};
    params = req.query;
    if(params.search){
        query += " WHERE name LIKE :search OR email LIKE :search";
        replacements.search = '%'+params.search+'%';
    }
    db.sequelize.query(query,{
        replacements : replacements,
        type: db.sequelize.QueryTypes.SELECT 
    }).then(function(users) {
        res.status(200).json(users);
    })
}

exports.getCars = function(req, res){

    // Make query
    var query = "SELECT brand, model, year, price FROM cars WHERE status = 1";
    var replacements = {};
    // Make filters and search
    var params = req.query;
    if(params){
        if(params.brand){
            query += " AND brand LIKE :car_brand";
            replacements.car_brand = '%'+params.brand+'%';
        }
        if(params.model){
            query += " AND model LIKE :car_model";
            replacements.car_model = '%'+params.model+'%';
        }
        if(params.year){
            query += " AND year = :year";
            replacements.year = params.year;
        }
        if(params.min_price){
            query += " AND price >= :min_price";
            replacements.min_price = parseFloat(params.min_price);
        }
        if(params.max_price){
            query += " AND price <= :max_price";
            replacements.max_price = parseFloat(params.max_price);
        }
    }
    // Get results
    db.sequelize.query(query,{
        replacements : replacements,
        type: db.sequelize.QueryTypes.SELECT 
    }).then(function(cars) {
        res.status(200).json(cars);
    })
}
exports.tagUsers = function(req, res){
    var tag = req.body.tag;
    var userArray = req.body.user_ids;
    
    userArray.forEach(function(userId){
        db.User.findOne({
            where : {
                id : userId
            }
        }).then(function(user){
            if(user){
                user.update({
                    tag : tag
                })
            }
        })
    })

    res.status(200).json({
        message : "Users tag updated"
    })
    
    
}
exports.featureCar = function(req,res){
    var userId = req.userData.id;
    var carId = req.params.car_id;

    db.Car.findOne({
        where: {
            id : carId
        },
        include : [
            {
                model: db.User
            }
        ]
    }).then(function(car){
        if(!car){
            res.status(404).json({
                error : "Car not found"
            });
        }else if(car && car.user_id != userId){
            res.status(500).json({
                error:"Unauthorized call"
            })
        }else{
            var user = car.User;
            if(!user.tag || user.tag != "Beta"){
                res.status(500).json({
                    error : "User is not Beta. Only Beta users can feature cars"
                })
            }else{
                
                car.updateAttributes({
                    featured :true
                }).then(function(car){
                    res.status(201).json({
                        message : "car is marked as featured"
                    })
                })
            }
        }
    })  
}

exports.getCurrentUser = function(req,res){
    var userId = req.userData.id;
    db.User.findOne({
        where: {
            id : userId
        },
        include : [
            {
                model:db.Car
            }
        ]
    }).then(function(user){
        if (user) {
            response = {
                name:user.name,
                email:user.email,
                tag : user.tag,
                cars : user.Cars
            }
            res.status(200).json(response);
        }else{
            res.status(404).json({
                error:"user not found"
            })
        }
    })
}

exports.carListing = function (req,res) {
    // Validations
    req.check('brand', 'brand is required').notEmpty();
    req.check('model', 'model is required').notEmpty();
    req.check('year', 'year is required').notEmpty();
    req.check('price', 'price is required').notEmpty();
    
    var errors = req.validationErrors();

    var brand = req.body.brand;
    var model = req.body.model;
    var year = req.body.year;
    var price = req.body.price;
    var featured = false;
    var userId = req.userData.id;

    if(errors){
        res.json({
            error : errors[0].msg
        });
    }else{
        db.User.findOne({
            where : {
                id : userId
            }
        }).then(function(user){
            if(user){
                db.Car.create({
                    user_id: user.id,
                    brand: brand,
                    model : model,
                    year: year,
                    price: price,
                    featured: featured,
                    status : true
                }).then(function(response){
                    res.json(response);
                })
            }else{
                res.status(500).json({
                    error: "user not found"
                })
            }
        })
    }
}

exports.register = function(req,res){
    // Validations
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'email is required').notEmpty();
    req.check('email', 'email is not valid').isEmail();
    req.check('password', 'password is required').notEmpty();

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    
    
    var errors = req.validationErrors();
    if(errors){
        res.json({
            error : errors[0].msg
        });
    }else{
        // check if user already exists
        db.User.findOne({
            where: {
                email:email
            }
        }).then(function(user){
            if(user){
                res.status(409).json({
                    error : "user already exists"
                })
            }else{
                bcrpyt.hash(password,10,function(err, hash){
                    if(err){
                        res.status(500).json({
                            error : err
                        })
                    }else{

                        db.User.create({
                            name : name,
                            email : email,
                            password : hash,
                            tag : "Normal"
                        }).then(function(newUser){
                            res.status(201).json({
                                msg : "user created",
                                data : {
                                    id : newUser.id,
                                    name : newUser.name,
                                    email : newUser.email,
                                    tag: newUser.tag
                                }
                            });
                        })
                    }
               })
            }
        })
    }

}

exports.auth = function(req, res){
    req.check('email', 'email is required').notEmpty();
    req.check('email', 'email is not valid').isEmail();
    req.check('password', 'password is required').notEmpty();

    var email = req.body.email;
    var password = req.body.password;
    
    // find user by email
    db.User.findOne({
        where : {
            email:email
        }
    }).then(function(user){
        if(!user){
            res.status(401).json({
                error : "authentication failed"
            })
        }else{
            // compare passwords hash in bcrypt
            bcrpyt.compare(password,user.password,function(err,result){
                if(err){
                    res.status(401).json({
                        error : err
                    })
                }else if(result){
                    const token = jwt.sign({
                        email:email,
                        id : user.id
                    },config.secret,{ 
                        expiresIn:"1h",
                        algorithm : "HS256"
                    })

                    res.status(200).json({
                        message:"authentication successfull",
                        token:token
                    })

                }else{
                    res.status(400).json({
                        error : "authentication failed"
                    })
                }

            })
        }
    })
   
}

exports.editCarListing = function(req,res){
    var userId = req.userData.id;
    var model = req.body.model;
    var brand = req.body.brand;
    var year = req.body.year;
    var price = req.body.price;

    var carId = req.params.car_id;

    db.Car.findOne({
        where : {
            id : carId
        }
    }).then(function(car){
        if(!car || car.user_id != userId){
            res.status(400).json({
                error : "Unautherized access"
            });
        }
        car.update({
            brand : brand ? brand : car.brand,
            model : model ? model : car.model,
            year : year ? year : car.year,
            price : price ? price : car.price
        }).then(function(updatedCar){
            res.status(201).json({
                msg : "Car details updated"
            });
        })
    })
}
