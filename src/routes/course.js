import { Router } from 'express';
import { getCourses } from '../controllers/course.js';

const router = Router({ mergeParams: true });

router.route('/').get(getCourses);

export { router as courseRoute };
