import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import PostModel from "@/models/post.model";

export const GET = async (req: Request) => {
  await dbConnect();

  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("author", "name");

    return Response.json(
      {
        success: true,
        message: "Posts fetched successfully",
        posts,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while fetching posts",
      },
      { status: 500 }
    );
  }
};
