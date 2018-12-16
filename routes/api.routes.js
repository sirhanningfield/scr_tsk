const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.controller');
const auth = require('../middleware/auth');


router.get('/current-user', auth, apiController.getCurrentUser);
router.post('/car-listing', auth, apiController.carListing);
router.put('/car-listing/:car_id', auth, apiController.editCarListing);
router.post('/register', apiController.register);
router.post('/auth', apiController.auth);
router.put('/feature-car/:car_id', auth, apiController.featureCar);
router.put('/tag-users', apiController.tagUsers);
router.get('/users', auth, apiController.getUsers);
router.get('/cars', apiController.getCars);




module.exports = router;