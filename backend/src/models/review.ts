import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    sellerId: { type: String, required: true },
    authorId: { type: String, required: true },
    header: { type: String, required: true },
    body: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true },
);

export type Review = HydratedDocument<InferSchemaType<typeof ReviewSchema>>;

export default model<Review>("Product", ReviewSchema);
