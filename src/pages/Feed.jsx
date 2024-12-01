import React, { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import PostCatd from "../components/PostCatd";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { LoaderPinwheel } from "lucide-react";
import Highlights from "../components/Highlights";
import { Input } from "@/components/ui/input";
import UserCard from "../components/UserCard";

const feed = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState("");
  const [query, setQuery] = useState("");
  const user = useSelector((state) => state.user.user);

  const {
    data: feed = [],
    isLoading: feedLoading,
    isError: feedError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(
        `/user/feed?page=${pageParam}&limit=10`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    onSuccess: (data) => {
      // toast({ description: data.message || "feed fetched successfully" });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  const searchUsers = useMutation({
    mutationKey: ["users"],
    mutationFn: async (query) => {
      const response = await axiosInstance.get(
        `/connection/search?query=${query}`
      );
      return response.data;
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    let timer = setTimeout(() => {
      searchUsers.mutate(query);
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);
  // e.preventDefault();

  // };

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
        <LoaderPinwheel className="animate-spin text-blue-600 " />
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
    <main className="flex flex-col items-center py-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 mt-5 min-h-screen">
      {user && <Highlights className="mb-5" />}

      <section className="max-w-2xl px-6 my-4 w-full">
        <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-lg border border-gray-200">
          <Input
            placeholder="Search users by name, headline, and skills"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-300 focus:outline-none"
          />
        </div>
        <section className="mt-6 space-y-4">
          {searchUsers &&
            query &&
            searchUsers.data &&
            searchUsers.data?.data?.length > 0 &&
            searchUsers?.data?.data?.map((user) => (
              <UserCard
                key={user?._id}
                user={user}
                isSearch={"searching"}
                className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 shadow-md hover:shadow-lg"
              />
            ))}
        </section>
      </section>

      <div className="max-w-2xl w-full">
        {user && (
          <section className="w-full mb-8">
            <form
              onSubmit={handleAddPost}
              className="flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-800">Add New Post</h2>
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300"
              />
              <Button
                type="submit"
                disabled={addPostMutation.isPending}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
              >
                {addPostMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </form>
          </section>
        )}

        {feed?.data?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No feed available</p>
        ) : (
          <div className="space-y-6">
            {feed?.pages?.map((p) =>
              p?.data?.map((post) => (
                <PostCatd
                  key={post._id}
                  post={post}
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg border border-gray-200"
                />
              ))
            )}
          </div>
        )}
      </div>

      <p className="flex justify-center items-center py-6">
        {isFetchingNextPage && (
          <LoaderPinwheel className="animate-spin text-purple-500" size={33} />
        )}
      </p>
    </main>
  );
};

export default feed;
