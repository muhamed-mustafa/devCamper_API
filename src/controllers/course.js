import asyncHandler from 'express-async-handler';
import { Course } from '../models/course.js';

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    ...(req.params.bootcampId && { bootcamp: req.params.bootcampId }),
  });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

export { getCourses };
