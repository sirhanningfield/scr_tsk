const express = require('express');
const router = express.Router();

router.get('/car-listing', function(req,res){
    res.send("cars");
});


module.exports = router;