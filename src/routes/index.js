import { bootCampRoute } from "./bootcamp.js";

const mountRoutes = (app) => {
  app.use("/api/v1/bootcamps", bootCampRoute);
};

export { mountRoutes };
