"use client";

import React, { useEffect, useState } from "react";
import PostCard from "@/components/Postcard";
import { Post } from "@/models/post.model";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import CreatePostModal from "@/components/CreatePostModal";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const MyPostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await axios.get("/api/get-posts-by-user");
      setPosts(response.data.posts);
    } catch (error: any) {
      toast.error("Failed to fetch your posts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1e2e] to-[#1e293b] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {session?.user && (
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-md w-fit mx-auto text-center">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xl">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div>
              <h3 className="text-lg font-semibold">{session.user.name}</h3>
              <p className="text-sm text-gray-200">{session.user.email}</p>
              <p className="text-sm text-slate-300 mt-1">
                {session.user.bio || "No bio provided."}
              </p>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-2xl font-bold tracking-tight">My Posts</h2>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-md shadow cursor-pointer"
          >
            Create Post
          </Button>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-400">
            You haven’t posted anything yet.
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      <CreatePostModal open={modalOpen} setOpen={setModalOpen} />
    </main>
  );
};

export default MyPostsPage;
