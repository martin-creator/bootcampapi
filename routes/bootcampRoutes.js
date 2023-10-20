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

const router = express.Router();

// Include other resource routers
const courseRoutes = require('./courseRoutes');

const {protectRoute} = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRoutes);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(createBootcamp)
    .delete(deleteAllBootcamps);


router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;

