import { Router } from "express";
import { deleteUrl, shortenUrl } from "../controllers/url.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/shorten").post(verifyJWT, shortenUrl);
router.route("/delete").delete(verifyJWT, deleteUrl);
// router.route("/getUrlByUser").delete(verifyJWT, deleteUrl);

export default router;
