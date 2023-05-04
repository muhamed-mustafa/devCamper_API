import asyncHandler from "express-async-handler";
import { BootCamp } from "../models/bootcamp.js";

// @desc      Get all bootCamps
// @route     GET /api/v1/bootCamps
// @access    Public
const getBootCamps = asyncHandler(async (req, res) => {
  const bootCamps = await BootCamp.find();
  res
    .status(200)
    .json({ success: true, count: bootCamps.length, data: bootCamps });
});

// @desc      Get single bootCamp
// @route     GET /api/v1/bootCamps/:id
// @access    Public
const getBootCamp = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const bootCamp = await BootCamp.findById(id);

  if (!bootCamp) {
    return res.status(400).json({ success: false });
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
const updateBootCamp = asyncHandler(async (req, res) => {
  let { id } = req.params;

  const bootCamp = await BootCamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootCamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: bootCamp });
});

// @desc      Delete bootCamp
// @route     DELETE /api/v1/bootCamps/:id
// @access    Private
const deleteBootCamp = asyncHandler(async (req, res) => {
  let { id } = req.params;

  const bootCamp = await BootCamp.findByIdAndDelete(id);

  if (!bootCamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: {} });
});

export {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
};
