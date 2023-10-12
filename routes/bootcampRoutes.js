const express = require('express');
const router = express.Router();
import {getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
} from '../controllers/bootcampController.js';

router.get('/', getBootcamps);

router.get('/:id', getBootcamp);

router.post('/', createBootcamp);

router.put('/:id', updateBootcamp);

router.delete('/:id', deleteBootcamp);

module.exports = router;

