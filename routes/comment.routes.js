import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComment,
} from "../controllers/comment.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/:videoId").get(getVideoComment).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
