import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.js';
import { advancedResults } from '../middleware/advancedResults.js';
import { User } from '../models/user.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/users', () => {});

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export { router as userRoute };
