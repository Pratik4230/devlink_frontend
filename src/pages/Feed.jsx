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
    <main className="flex flex-col  items-center py-2 bg-gradient-to-b from-gray-100 to-gray-50 mt-5 min-h-screen  ">
      {user && <Highlights className="mb-5" />}

      <section className=" max-w-2xl px-5 my-2   rounded-lg  w-full">
        <div className=" flex items-center justify-center  p-2 bg-gray-50 rounded-lg shadow-md">
          <Input
            placeholder="Search users by name, headline and skills "
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className=" w-full max-w-md rounded-md border-2 border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none "
          />
        </div>
        <section>
          {searchUsers &&
            query &&
            searchUsers.data &&
            searchUsers.data?.data?.length > 0 &&
            searchUsers?.data?.data?.map((user) => (
              <UserCard key={user?._id} user={user} isSearch={"searching"} />
            ))}
        </section>
      </section>

      <div className="max-w-2xl w-full">
        {user && (
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
        )}

        {feed?.data?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No feed available</p>
        ) : (
          <div className="space-y-6">
            {feed?.pages?.map((p) =>
              p?.data?.map((post) => <PostCatd key={post._id} post={post} />)
            )}
          </div>
        )}
      </div>

      <p className="flex justify-center items-center">
        {" "}
        {isFetchingNextPage && (
          <LoaderPinwheel
            className="animate-spin flex justify-center items-center text-blue-500"
            size={33}
          />
        )}{" "}
      </p>
    </main>
  );
};

export default feed;
