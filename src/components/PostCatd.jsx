import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Edit, Heart, MessageSquareQuote, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentSection from "./CommentSection";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { author, content, createdAt, likeCount, _id, isLiked } = post;

  const PostEditMutation = useMutation({
    mutationFn: async (newPost) => {
      const response = await axiosInstance.put(`/post/update/${_id}`, {
        content: newPost,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["feed"]);
      toast({ description: data.message || "Post updated successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const PostDeleteMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/post/delete/${_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["feed"]);
      toast({ description: data.message || "Post deleted successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const PostLikeMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.post(`/like/post/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["feed"]);
      queryClient.invalidateQueries(["posts", author?._id]);
      toast({ description: data.message || "Post liked successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (comment) => {
      const response = await axiosInstance.post(`/comment/add/${_id}`, {
        content: comment,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments", _id]);

      toast({ description: data.message || "Comment added successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const handleEditPost = (e) => {
    e.preventDefault();
    if (editedContent) {
      PostEditMutation.mutate(editedContent);
      setIsEditing(false);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText) {
      addCommentMutation.mutate(commentText);
    }
    setCommentText("");
  };

  return (
    <main className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-xl">
      <div className="flex justify-between">
        <section className="flex items-center mb-4">
          <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
            <AvatarImage src={author?.avatar} />
            <AvatarFallback>{author?.fullname[0]}</AvatarFallback>
          </Avatar>
          <Link
            className="ml-4 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg"
            to={`/profile/${author?._id}`}
          >
            <div>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {author?.fullname}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {author?.headline}
              </p>
            </div>
          </Link>
        </section>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Edit className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </button>

          <Trash
            onClick={() => PostDeleteMutation.mutate()}
            className="w-5 h-5 text-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      <section className="mb-6">
        {isEditing ? (
          <form onSubmit={handleEditPost}>
            <Textarea
              rows={10}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button type="submit" className="bg-blue-500 text-white">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-lg px-6">
            {content}
          </p>
        )}
      </section>

      <section className="flex justify-evenly items-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => PostLikeMutation.mutate(_id)}
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
        </div>

        <Button
          className="flex bg-white hover:bg-white text-black items-center space-x-2 hover:text-blue-600 dark:hover:text-indigo-100 transition duration-300"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquareQuote className="w-5  h-5" />
          <span className="hidden  sm:inline">Comments</span>
        </Button>

        <p className="text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(createdAt))} ago
        </p>
      </section>

      <section className="w-full">
        {showComments && (
          <div className="mt-4">
            <Textarea
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            />
            <Button
              onClick={handleAddComment}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Submit Comment
            </Button>

            <CommentSection postId={_id} />
          </div>
        )}
      </section>
    </main>
  );
};

export default PostCard;
