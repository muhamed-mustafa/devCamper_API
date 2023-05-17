import asyncHandler from 'express-async-handler';
import { Review } from '../models/review.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { getSingleBootCamp } from './bootcamp.js';

// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
const getReviews = asyncHandler(async (req, res) => {
  let { bootcampId } = req.params;

  let reviews = await Review.find({
    ...(req.params.bootcampId && { bootcamp: req.params.bootcampId }),
  });

  if (bootcampId)
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });

  res.status(200).json(res.advancedResults);
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
const addReview = asyncHandler(async (req, res, next) => {
  let { bootcampId } = req.params;
  await getSingleBootCamp(bootcampId);

  const review = await Review.create({
    ...req.body,
    user: req.user.id,
    bootcamp: bootcampId,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await getSingleReview(req, req.params.id);

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
const deleteReview = asyncHandler(async (req, res, next) => {
  let review = await getSingleReview(req, req.params.id);

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

const getSingleReview = async (req, id) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new ErrorResponse(`No review with the id of ${id}`, 404);
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to update review', 401);
  }

  return review;
};

export { getReviews, getReview, addReview, updateReview, deleteReview };
