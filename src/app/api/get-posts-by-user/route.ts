import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import mongoose from "mongoose";

export const GET = async (req: Request) => {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated!",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    const posts = await PostModel.find({ author: userId }).sort({ createdAt: -1 });

    return Response.json(
      {
        success: true,
        message: "User posts fetched successfully",
        posts,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while creating the post",
      },
      { status: 500 }
    );
  }
};
