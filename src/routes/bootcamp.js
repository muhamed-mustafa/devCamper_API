import { Router } from 'express';
import {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} from '../controllers/bootcamp.js';
import { courseRoute } from './course.js';
import { uploadFile } from '../middleware/file-upload.js';
import { advancedResults } from '../middleware/advancedResults.js';
import { BootCamp } from '../models/bootcamp.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRoute);

router
  .route('/:id/photo')
  .put(
    protect,
    authorize('publisher', 'admin'),
    uploadFile,
    bootcampPhotoUpload
  );

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
  .route('/')
  .get(advancedResults(BootCamp, 'courses'), getBootCamps)
  .post(protect, authorize('publisher', 'admin'), createBootCamp);
router
  .route('/:id')
  .get(getBootCamp)
  .put(protect, authorize('publisher', 'admin'), updateBootCamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootCamp);

export { router as bootCampRoute };
