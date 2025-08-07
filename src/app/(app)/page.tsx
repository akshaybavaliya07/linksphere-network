"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Postcard from "@/components/Postcard";
import { Post } from "@/models/post.model";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CreatePostModal from "@/components/CreatePostModal";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/get-posts");
      setPosts(response.data.posts);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1e2e] to-[#1e293b] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Community Posts</h2>
          {session?.user ? (
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-md shadow cursor-pointer"
            >
              Create Post
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/sign-in")}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-md shadow cursor-pointer"
            >
              Login to Create Post
            </Button>
          )}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-400">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Postcard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      <CreatePostModal open={modalOpen} setOpen={setModalOpen} />
    </main>
  );
};

export default HomePage;
