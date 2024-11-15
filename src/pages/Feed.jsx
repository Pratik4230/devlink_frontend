import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import PostCatd from "../components/PostCatd";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const feed = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState("");

  const {
    data: feed = [],
    isLoading: feedLoading,
    isError: feedError,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/feed");
      return response.data;
    },
    onSuccess: (data) => {
      // toast({ description: data.message || "feed fetched successfully" });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const addPostMutation = useMutation({
    mutationFn: async (newPost) => {
      const response = await axiosInstance.post("/post/create", {
        content: newPost,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast({ description: data?.message || "Post added successfully!" });
      queryClient.invalidateQueries("feed");
      setNewPostContent("");
    },
    onError: (error) => {
      toast({
        description: error?.response?.data?.message || "Failed to add post",
        variant: "error",
      });
      console.log("error", error);
    },
  });

  const handleAddPost = (e) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      addPostMutation.mutate(newPostContent);
    } else {
      toast({ description: "Post content cannot be empty", variant: "error" });
    }
  };

  if (feedLoading) {
    return (
      <div className="flex  items-center justify-center py-20">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        <p className="text-gray-500 ml-4">Loading feed...</p>
      </div>
    );
  }

  if (feedError) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
        <p className="text-center">Failed to load feed. Try again later.</p>
      </div>
    );
  }

  return (
    <main className="flex  justify-center py-8 bg-gradient-to-b from-gray-100 to-gray-50 mt-10 min-h-screen">
      <div className="max-w-2xl w-full">
        <section className="w-full max-w-2xl mb-6">
          <form
            onSubmit={handleAddPost}
            className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Post
            </h2>
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="border border-gray-300 rounded-md"
            />
            <Button
              type="submit"
              disabled={addPostMutation.isPending}
              className="mt-2"
            >
              {addPostMutation.isPending ? "Posting..." : "Post"}
            </Button>
          </form>
        </section>

        {feed?.data?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No feed available</p>
        ) : (
          <div className="space-y-6">
            {feed?.data?.map((post) => (
              <PostCatd key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default feed;
