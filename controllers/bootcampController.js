const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getBootcamps = asyncHandler(async (req, res, next) => {
        let query;



        // Copy req.query
        const reqQuery = {...req.query};

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

        // Select Fields
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
            
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit); // this line does the pagination by skipping the first 10 and limiting to 10


        // Executing query
        const bootcamps = await query;

        // Pagination result
        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200).json({ success: true, count: bootcamps.length,pagination, data: bootcamps });

});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
const getBootcamp = asyncHandler(async (req, res, next) => {
   
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp });
    
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
const createBootcamp = asyncHandler(async (req, res, next) => {
    
        const bootcamp = await Bootcamp.create(req.body)

        res.status(201).json({
            success: true,
            data: bootcamp
        });
   
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
   
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp });
    
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
const deleteBootcamp =  asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    console.log(bootcamp);

    if(!bootcamp){
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

   // Use deleteOne instead of deleteMany
   await bootcamp.deleteOne();

    res.status(200).json({success: true, data: {}});

});


// @desc    Delete All bootcamps
// @route   DELETE /api/v1/bootcamps
// @access  Private
const deleteAllBootcamps = asyncHandler(async (req, res, next) => {
    
        const bootcamps = await Bootcamp.deleteMany();

        if(!bootcamps){
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({success: true, data: {}});
    
});


// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    
        const { zipcode, distance } = req.params;

        // Get lat/lng from geocoder
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        // Calc radius using radians
        // Divide dist by radius of Earth
        // Earth Radius = 3,963 mi / 6,378 km
        const radius = distance / 3963;

        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
        });

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    
});

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private

const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
        
            const bootcamp = await Bootcamp.findById(req.params.id);
    
            if(!bootcamp){
                return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
            }
    
            if(!req.files){
                return  next(new ErrorResponse(`Please upload a file`, 400));
            }
    
            const file = req.files.file;
    
            // Make sure the image is a photo
            if(!file.mimetype.startsWith('image')){
                return  next(new ErrorResponse(`Please upload an image file`, 400));
            }
    
            // Check filesize
            if(file.size > process.env.MAX_FILE_UPLOAD){
                return  next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
            }
    
            // Create custom filename
            file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    
            file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
                if(error){
                    console.error(error);
                    return  next(new ErrorResponse(`Problem with file upload`, 500));
                }
    
                await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    
                res.status(200).json({
                    success: true,
                    data: file.name
                });
            });
        
    }
);


module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    deleteAllBootcamps,
    getBootcampsInRadius,
    bootcampPhotoUpload
}