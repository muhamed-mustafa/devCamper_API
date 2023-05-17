import { bootCampRoute } from './bootcamp.js';
import { courseRoute } from './course.js';
import { authRoute } from './auth.js';
import { userRoute } from './users.js';
import { reviewRoute } from './review.js';

const mountRoutes = (app) => {
  app.use('/api/v1/bootcamps', bootCampRoute);
  app.use('/api/v1/courses', courseRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/reviews', reviewRoute);
};

export { mountRoutes };
