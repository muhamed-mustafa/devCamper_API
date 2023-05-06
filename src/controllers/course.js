import asyncHandler from 'express-async-handler';
import { Course } from '../models/course.js';
import { getSingleBootCamp } from './bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    ...(req.params.bootcampId && { bootcamp: req.params.bootcampId }),
  }).populate({ path: 'bootcamp', select: 'name description' });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
const getCourse = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
const addCourse = asyncHandler(async (req, res, next) => {
  let { bootcampId } = req.params;
  await getSingleBootCamp(bootcampId);

  const course = await Course.create({ ...req.body, bootcamp: bootcampId });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
const updateCourse = asyncHandler(async (req, res, next) => {
  let { id } = req.params;

  const course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
const deleteCourse = asyncHandler(async (req, res, next) => {
  let { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  await course.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

export { getCourses, getCourse, addCourse, updateCourse, deleteCourse };
