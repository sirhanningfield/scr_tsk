const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.controller');
const auth = require('../middleware/auth');



router.get('/car-listing', auth, apiController.carListing);
router.post('/register', apiController.register);
router.post('/auth', apiController.auth);




module.exports = router;