"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import dayjs from "dayjs";
import { Post } from "@/models/post.model";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="bg-[#1e293b] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 text-white w-full p-5 flex flex-col">
      <div>
        <p className="text-base font-semibold text-white">
          {post.content || "No message content"}
        </p>
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-auto">
        {typeof post.author === "object" &&
        "name" in post.author &&
        post.author.name ? (
          <span>
            Posted by{" "}
            <span className="font-medium text-slate-100">
              {post.author.name}
            </span>
          </span>
        ) : null}

        <span>{dayjs(post.createdAt).format("MMM D, YYYY • h:mm A")}</span>
      </div>
    </Card>
  );
};

export default PostCard;
