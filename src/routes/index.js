import { bootCampRoute } from './bootcamps.js';

const mountRoutes = (app) => {
  app.use('/api/v1/bootcamps', bootCampRoute);
};

export { mountRoutes };
