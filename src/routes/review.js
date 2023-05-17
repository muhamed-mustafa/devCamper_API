import { Router } from 'express';
import { getReviews, addReview, getReview, updateReview, deleteReview } from '../controllers/reviews.js';
import { advancedResults } from '../middleware/advancedResults.js';
import { protect, authorize } from '../middleware/auth.js';
import { Review } from '../models/review.js';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

export { router as reviewRoute };
