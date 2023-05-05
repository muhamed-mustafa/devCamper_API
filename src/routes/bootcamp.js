import { Router } from 'express';
import {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
} from '../controllers/bootcamp.js';
import { courseRoute } from './course.js';

const router = Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRoute);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/').get(getBootCamps).post(createBootCamp);
router
  .route('/:id')
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

export { router as bootCampRoute };
