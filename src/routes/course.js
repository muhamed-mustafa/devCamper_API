import { Router } from 'express';
import {
  getCourses,
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.js';
import { advancedResults } from '../middleware/advancedResults.js';
import { Course } from '../models/course.js';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

export { router as courseRoute };
