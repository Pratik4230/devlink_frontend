import React from "react";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { toast } = useToast();

  // console.log("postid commentSection ", postId);

  const {
    data: comments,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/comment/post/${postId}`);
      return response?.data;
    },
    onSuccess: (data) => {
      // toast({
      //   description: data?.messsage || "Comments fetched successfully",
      // });
    },
    refetchInterval: 50000,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error?.response?.data?.messsage,
      });
    },
  });

  if (commentsLoading) {
    return <p>comments loading</p>;
  }

  if (commentsError) {
    return <p>error comment</p>;
  }

  return (
    <div className="mt-6">
      {!comments?.data || comments?.data?.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-6">
          <p className="text-lg font-medium">No comments yet</p>
          <p className="text-sm mt-2">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments?.data?.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Comment comment={comment} postId={postId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
