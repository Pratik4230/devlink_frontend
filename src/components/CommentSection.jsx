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
    <div className="mt-4">
      {!comments?.data || comments?.data?.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No comments yet</p>
        </div>
      ) : (
        <div>
          {comments?.data?.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
