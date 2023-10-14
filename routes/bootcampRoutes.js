const express = require('express');
const router = express.Router();
const {getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    deleteAllBootcamps,
    getBootcampsInRadius
} = require('../controllers/bootcampController');

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)
    .delete(deleteAllBootcamps);


router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;

