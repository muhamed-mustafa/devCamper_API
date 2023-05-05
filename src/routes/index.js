import { bootCampRoute } from './bootcamp.js';
import { courseRoute } from './course.js';

const mountRoutes = (app) => {
  app.use('/api/v1/bootcamps', bootCampRoute);
  app.use('/api/v1/courses', courseRoute);
};

export { mountRoutes };
