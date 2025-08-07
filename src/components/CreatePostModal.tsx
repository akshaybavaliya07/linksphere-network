"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "react-toastify";

interface CreatePostModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CreatePostModal = ({ open, setOpen }: CreatePostModalProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/create-post", { content });
      toast.success(response.data.message || "Post created!");
      setContent("");
      setOpen(false);
      window.location.reload(); // or callback
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="backdrop-blur-sm bg-[#1e293b]/80 border border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>

        <Textarea
          className="bg-slate-800 text-white"
          placeholder="What's on your mind?"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 cursor-pointer rounded-md shadow"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;