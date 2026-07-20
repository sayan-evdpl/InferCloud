import { Router } from "express";
import {
  searchAll,
  getLocalGpus,
  getCloudProviders,
  getSystems,
  getTcoData,
  getBandwidthData,
  getExternalSpecs,
} from "../controllers/gpu.controllers.js";

const router = Router();

router.route("/search").get(searchAll);
router.route("/local").get(getLocalGpus);
router.route("/cloud").get(getCloudProviders);
router.route("/systems").get(getSystems);
router.route("/tco").get(getTcoData);
router.route("/bandwidth").get(getBandwidthData);
router.route("/external-specs").get(getExternalSpecs);

export default router;
