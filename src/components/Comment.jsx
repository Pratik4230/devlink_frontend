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
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex justify-between">
        <section className="flex items-center mb-4">
          <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
            <AvatarImage src={avatar} />
            <AvatarFallback>{fullname[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {fullname}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {headline}
            </p>
          </div>
        </section>

        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {" "}
              <Edit className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
            <Trash
              onClick={() => deleteCommentMutation.mutate()}
              className="w-5 h-5 text-gray-800 cursor-pointer dark:text-gray-200"
            />
          </div>
        )}
      </div>

      <section className="mb-6">
        {isEditing ? (
          <div>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            />
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Save
            </Button>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-lg">{content}</p>
        )}
      </section>

      <section className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm">
        <Button
          onClick={() => likeCommentMutation.mutate(_id)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Heart
            className={`w-7 h-7 ${
              isLiked && "fill-red-500"
            } text-blue-600 dark:text-blue-400`}
          />
        </Button>
        <p className="text-gray-800 dark:text-gray-100 font-medium">
          {likeCount} Likes
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(createdAt))} ago
        </p>
      </section>
    </div>
  );
};

export default Comment;
