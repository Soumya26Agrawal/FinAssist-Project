import { Router } from "express";
const router = Router();
import { storeDetails } from "../controllers/user.controller.js";

router.route("/saveDetails").post(storeDetails);

export default router;
