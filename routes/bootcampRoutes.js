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

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

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

