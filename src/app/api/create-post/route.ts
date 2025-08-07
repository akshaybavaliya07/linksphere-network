import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import mongoose from "mongoose";

export const POST = async (req: Request) => {
  await dbConnect();
  const { content } = await req.json();
  if (!content || content.trim() === "") {
    return Response.json(
      { success: false, message: "content is required" },
      { status: 400 }
    );
  }

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
    await PostModel.create({
      author: userId,
      content,
    });

    return Response.json({
      success: true,
      message: "Post created successfully",
    });
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
