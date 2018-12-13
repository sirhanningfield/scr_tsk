const jwt = require('jsonwebtoken');
const config = require('../config/config');
module.exports = function(req,res,next){
    if(req.headers.authorization){
        var token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, config.secret, {algorithms:["HS256"]}, function(err, decoded) {
            if(err){
                res.status(401).json({
                    error:err.message
                })
            }else{
                next();
            }
        });
    }else{
        res.status(401).json(
           { error:"token not provided"}
        )
    }
    
}