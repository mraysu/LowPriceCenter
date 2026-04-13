import { Response } from "express";
import ReviewModel from "src/models/review";
import UserModel from "src/models/user";

import { AuthenticatedRequest } from "src/validators/authUserMiddleware";

interface CreateReviewRequest {
  sellerId: string;
  header: string;
  body: string;
  rating: number;
}

export const createReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data: CreateReviewRequest = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized request" });
    const authorId = req.user?.firebaseUid;

    const review = await ReviewModel.create({ ...data, authorId });
    if (!review) return res.status(400).json({ message: "Errror creating review" });
    return res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

export const getReviewsByAuthor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authorId = req.params.firebaseUid;
    //validate authorId
    const author = await UserModel.findOne({ firebaseUid: authorId });
    if (!author) return res.status(404).json({ message: "User not found" });

    //get reviews
    const reviews = await ReviewModel.find({ authorId });
    return res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error getting review", error });
  }
};

export const getReviewsBySeller = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sellerId = req.params.firebaseUid;
    //validate authorId
    const seller = await UserModel.findOne({ firebaseUid: sellerId });
    if (!seller) return res.status(404).json({ message: "User not found" });

    //get reviews
    const reviews = await ReviewModel.find({ sellerId });
    return res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error getting review", error });
  }
};

export const deleteReviewById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    await ReviewModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};
