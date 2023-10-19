const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getBootcamps = asyncHandler(async (req, res, next) => {
        
            res.status(200).json(res.advancedResults);

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