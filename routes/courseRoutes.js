const express = require('express');
const { 
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router({ mergeParams: true });

const {protectRoute} = require('../middleware/auth');

router.route('/')
.get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses)
.post(protectRoute, addCourse);

router.route('/:id')
.get(getCourse)
.put(protectRoute, updateCourse)
.delete(protectRoute, deleteCourse);

module.exports = router;