import asyncHandler from 'express-async-handler';
import { Course } from '../models/course.js';
import { getSingleBootCamp } from './bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
const getCourses = asyncHandler(async (req, res) => {
  await Course.find({
    ...(req.params.bootcampId && { bootcamp: req.params.bootcampId }),
  });
  res.status(200).json(res.advancedResults);
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
const getCourse = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const course = await getSingleCourse(id);
  res.status(200).json({ success: true, data: course });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
const addCourse = asyncHandler(async (req, res) => {
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
const updateCourse = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let course = await getSingleCourse(id);

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
const deleteCourse = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const course = await getSingleCourse(id);
  await course.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

const getSingleCourse = async (id) => {
  const course = await Course.findById(id);

  if (!course) {
    throw new ErrorResponse(`Course not found with id of ${id}`, 404);
  }

  return course;
};

export { getCourses, getCourse, addCourse, updateCourse, deleteCourse };
