import express from "express";
import {
  getReviewsByAuthor,
  getReviewsBySeller,
  createReview,
  deleteReviewById,
} from "src/controllers/review";

const router = express.Router();

router.get("/author/:firebaseUid", getReviewsByAuthor);
router.get("/seller/:firebaseUid", getReviewsBySeller);
router.post("/", createReview);
router.delete("/:id", deleteReviewById);

export default router;
