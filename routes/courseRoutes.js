const express = require('express');
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');

const Course = require('../models/Course');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

const { protectRoute } = require('../middleware/auth');

router.route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(addCourse);

router.route('/:id')
    .get(getCourse)
    .put( updateCourse)
    .delete(deleteCourse);

module.exports = router;