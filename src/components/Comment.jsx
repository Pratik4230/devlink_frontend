import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Heart, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

const Comment = ({ comment, postId }) => {
  const { content, _id, createdAt, isLiked, likeCount } = comment;
  // console.log("comment", comment);

  const { fullname, headline, avatar } = comment?.users;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const user = useSelector((state) => state.user.user);

  const isOwner = user?._id === comment?.users?._id;

  const updateCommentMutation = useMutation({
    mutationFn: async (newContent) => {
      const response = await axiosInstance.put(`/comment/update/${_id}`, {
        content: newContent,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments", postId]);
      toast({ description: data.message || "Comment updated successfully" });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/comment/delete/${_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments", postId]);
      toast({ description: data.message || "Comment deleted successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await axiosInstance.post(`/like/comment/${commentId}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments", postId]);
      toast({ description: data.message || "Post liked successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const handleSaveEdit = () => {
    if (editedContent) {
      updateCommentMutation.mutate(editedContent);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 lg:p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 mb-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        {/* User Info */}
        <section className="flex items-center">
          <Avatar className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
            <AvatarImage src={avatar} />
            <AvatarFallback>{fullname[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">
              {fullname}
            </p>
            <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">
              {headline}
            </p>
          </div>
        </section>

        {/* Edit/Delete Actions */}
        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 shadow focus:ring-2 focus:ring-indigo-500"
              aria-label="Edit comment"
            >
              <Edit className="text-gray-800 dark:text-gray-200 w-5 h-5" />
            </button>
            <button
              onClick={() => deleteCommentMutation.mutate()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 shadow focus:ring-2 focus:ring-red-500"
              aria-label="Delete comment"
            >
              <Trash className="text-red-600 dark:text-red-400 w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <section className="mt-4">
        {isEditing ? (
          <div className="flex flex-col space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Edit your comment..."
            />
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Save
            </Button>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-lg">{content}</p>
        )}
      </section>

      {/* Footer */}
      <section className="mt-4 flex items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm">
        {/* Like Button */}
        <button
          onClick={() => likeCommentMutation.mutate(_id)}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            isLiked
              ? "bg-red-100 dark:bg-red-900 text-red-500"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          } hover:scale-110 hover:shadow-md`}
        >
          <Heart
            className={`w-6 h-6 ${
              isLiked ? "fill-red-500" : "fill-transparent"
            } transition-all`}
          />
        </button>
        <p className="font-medium text-gray-800 dark:text-gray-100">
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(createdAt))} ago
        </p>
      </section>
    </div>
  );
};

export default Comment;
