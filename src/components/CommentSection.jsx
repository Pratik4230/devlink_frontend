import React from "react";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  console.log("op", postId);

  const { toast } = useToast();

  const {
    data: comments,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/comment/post/${postId}`);
      return response?.data;
    },
    onSuccess: (data) => {
      toast({
        description: data?.messsage,
      });
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

  console.log("comments", comments);

  return (
    <div>
      <p>
        {comments?.data?.length == 0 ? (
          <p>hii</p>
        ) : (
          comments?.data?.map((comment) => (
            <Comment key={comment?._id} comment={comment} />
          ))
        )}
      </p>
    </div>
  );
};

export default CommentSection;
