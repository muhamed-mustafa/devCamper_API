import { Router } from 'express';
import {
  getCourses,
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.js';

const router = Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

export { router as courseRoute };
