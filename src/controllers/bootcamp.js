// @desc      Get all bootCamps
// @route     GET /api/v1/bootCamps
// @access    Public

const getBootCamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootCamps' });
};

// @desc      Get single bootCamp
// @route     GET /api/v1/bootCamps/:id
// @access    Public
const getBootCamp = async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootCamp ${req.params.id}` });
};

// @desc      Create new bootCamp
// @route     POST /api/v1/bootCamps
// @access    Private
const createBootCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new bootCamp' });
};

// @desc      Update bootCamp
// @route     PUT /api/v1/bootCamps/:id
// @access    Private
const updateBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootCamp ${req.params.id}` });
};

// @desc      Delete bootCamp
// @route     DELETE /api/v1/bootCamps/:id
// @access    Private
const deleteBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootCamp ${req.params.id}` });
};

export {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
};
