import { ErrorResponse } from '../utils/errorResponse.js';
import path from 'path';
import asyncHandler from 'express-async-handler';

export const uploadFile = asyncHandler(async (req, _res, next) => {
  if (!req.files) return next(new ErrorResponse('Please upload a file ', 400));

  const { file } = req.files;

  if (!file.mimetype.startsWith('image'))
    return next(
      new ErrorResponse('Please upload an image file, Only Image Allowed', 400)
    );

  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`);

  req.fileName = file.name;

  next();
});
