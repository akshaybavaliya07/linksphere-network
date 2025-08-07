import mongoose, { Schema, Document } from "mongoose";

export interface Post extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<Post> = new Schema(
  {
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel =
  mongoose.models.Post || mongoose.model<Post>("Post", PostSchema);

export default PostModel;
