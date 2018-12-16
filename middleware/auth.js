const jwt = require('jsonwebtoken');
const config = require('../config/env');
module.exports = function(req,res,next){
    if(req.headers.authorization){
        var token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, config.secret, {algorithms:["HS256"]}, function(err, decoded) {
            if(err){
                res.status(401).json({
                    error:err.message
                })
            }else{
                req.userData = decoded;
                next();
            }
        });
    }else{
        res.status(401).json(
           { error:"token not provided"}
        )
    }
    
}