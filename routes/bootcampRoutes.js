const express = require('express');
const {getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    deleteAllBootcamps,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcampController');

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
const courseRouter = require('./courseRoutes');

const router = express.Router();

const {protectRoute} = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo')
    .put(protectRoute, bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protectRoute,createBootcamp)
    .delete(protectRoute, deleteAllBootcamps);


router.route('/:id')
    .get(getBootcamp)
    .put(protectRoute, updateBootcamp)
    .delete(protectRoute, deleteBootcamp);

module.exports = router;

