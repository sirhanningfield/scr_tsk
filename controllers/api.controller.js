const bcrpyt = require('bcrypt');
const db = require('../models');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.carListing = function (req,res) {
    res.send("hello ji");
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
                            token : null
                        }).then(function(newUser){
                            res.status(201).json({data:newUser});
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
                        error : "authentication failed"
                    })
                }else if(result){
                    const token = jwt.sign({
                        email:email,
                        id : user.id
                    },config.secret,{ 
                        expiresIn:"1h",
                        algorithm : "HS256"
                    })

                    res.json({
                        message:"authentication successfull",
                        token:token
                    })

                }

            })
        }
    })
   
}
