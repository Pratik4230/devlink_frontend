import React from "react";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import PostCatd from "../components/PostCatd";

const feed = () => {
  const { toast } = useToast();

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
      toast({ description: data.message || "feed fetched successfully" });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  if (feedLoading) {
    <p>loading</p>;
  }

  if (feedError) {
    <p>error</p>;
  }

  // console.log("feed", feed);

  return (
    <main className="flex justify-center py-6 bg-gray-50">
      <div className="max-w-2xl w-full">
        {feed?.data?.length === 0 ? (
          <p className="text-center text-gray-500">No feed available</p>
        ) : (
          feed?.data?.map((post) => <PostCatd key={post._id} post={post} />)
        )}
      </div>
    </main>
  );
};

export default feed;
