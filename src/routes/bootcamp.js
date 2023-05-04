import { Router } from "express";
import {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
} from "../controllers/bootcamp.js";

const router = Router();

router.route("/").get(getBootCamps).post(createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

export { router as bootCampRoute };
