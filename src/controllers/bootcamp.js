import asyncHandler from 'express-async-handler';
import { BootCamp } from '../models/bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { geocoder } from '../utils/geocoder.js';

// @desc      Get all bootCamps
// @route     GET /api/v1/bootCamps
// @access    Public
const getBootCamps = asyncHandler(async (req, res) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = BootCamp.find(JSON.parse(queryStr)).populate('courses');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
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
  const total = await BootCamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootCamps = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootCamps.length,
    pagination,
    data: bootCamps,
  });
});

// @desc      Get single bootCamp
// @route     GET /api/v1/bootCamps/:id
// @access    Public
const getBootCamp = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const bootCamp = await BootCamp.findById(id);

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

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

  const bootCamp = await BootCamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootCamp });
});

// @desc      Delete bootCamp
// @route     DELETE /api/v1/bootCamps/:id
// @access    Private
const deleteBootCamp = asyncHandler(async (req, res, next) => {
  let { id } = req.params;

  const bootCamp = await BootCamp.findById(id);

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

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
};
