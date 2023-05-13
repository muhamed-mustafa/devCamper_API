import asyncHandler from 'express-async-handler';
import { BootCamp } from '../models/bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { geocoder } from '../utils/geocoder.js';

// @desc      Get all bootCamps
// @route     GET /api/v1/bootCamps
// @access    Public
const getBootCamps = asyncHandler(async (_req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single bootCamp
// @route     GET /api/v1/bootCamps/:id
// @access    Public
const getBootCamp = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const bootCamp = await getSingleBootCamp(id);
  res.status(200).json({ success: true, data: bootCamp });
});

// @desc      Create new bootCamp
// @route     POST /api/v1/bootCamps
// @access    Private
const createBootCamp = asyncHandler(async (req, res) => {
  const bootCamp = await BootCamp.create(req.body);
  res.status(201).json({ success: true, data: bootCamp });
});

// @desc      Update bootCamp
// @route     PUT /api/v1/bootCamps/:id
// @access    Private
const updateBootCamp = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  let bootCamp = await getSingleBootCamp(id);

  bootCamp = await BootCamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootCamp });
});

// @desc      Delete bootCamp
// @route     DELETE /api/v1/bootCamps/:id
// @access    Private
const deleteBootCamp = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const bootCamp = await getSingleBootCamp(id);
  await bootCamp.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
const getBootcampsInRadius = asyncHandler(async (req, res) => {
  const { distance, zipcode } = req.params;

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootCamps = await BootCamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootCamps.length,
    data: bootCamps,
  });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
const bootcampPhotoUpload = asyncHandler(async (req, res) => {
  await getSingleBootCamp(req.params.id);

  await BootCamp.findByIdAndUpdate(req.params.id, {
    $set: { photo: req.fileName },
  });

  res.status(200).json({
    success: true,
    data: req.fileName,
  });
});

const getSingleBootCamp = async (id) => {
  const bootCamp = await BootCamp.findById(id);

  if (!bootCamp) {
    throw new ErrorResponse(`Bootcamp not found with id of ${id}`, 404);
  }

  return bootCamp;
};

export {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
  getSingleBootCamp,
  bootcampPhotoUpload,
};
