import { bootCampRoute } from './bootcamp.js';
import { courseRoute } from './course.js';
import { authRoute } from './auth.js';

const mountRoutes = (app) => {
  app.use('/api/v1/bootcamps', bootCampRoute);
  app.use('/api/v1/courses', courseRoute);
  app.use('/api/v1/auth', authRoute);
};

export { mountRoutes };
