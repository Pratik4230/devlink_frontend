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
import { useSelector } from "react-redux";

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { author, content, createdAt, likeCount, _id, isLiked } = post;

  const user = useSelector((state) => state.user.user);

  const isOwner = user?._id === author?._id;

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
    <main className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-xl rounded-lg p-4 lg:p-8 mb-8 border border-gray-300 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-2xl">
      <div className="flex justify-between items-center">
        <section className="flex items-center gap-2 md:gap-4">
          <Avatar className="lg:w-16 lg:h-16 rounded-full border-4 border-indigo-400 dark:border-purple-600 shadow-lg">
            <AvatarImage src={author?.avatar} />
            <AvatarFallback className="text-indigo-500 dark:text-purple-400 bg-indigo-100 dark:bg-gray-800">
              {author?.fullname[0]}
            </AvatarFallback>
          </Avatar>
          <Link
            to={`/profile/${author?._id}`}
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg"
          >
            <div>
              <p className="md:text-2xl font-bold text-gray-900 dark:text-white">
                {author?.fullname}
              </p>
              <p className="text-sm text-indigo-600 dark:text-purple-400">
                {author?.headline}
              </p>
            </div>
          </Link>
        </section>
        {isOwner && (
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-10 h-10 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-purple-600 dark:hover:bg-purple-700 shadow-lg transition"
            >
              <Edit className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={() => PostDeleteMutation.mutate()}
              className="w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg transition"
            >
              <Trash className="w-5 h-5 mx-auto" />
            </button>
          </div>
        )}
      </div>

      <section className="my-6">
        {isEditing ? (
          <form onSubmit={handleEditPost}>
            <Textarea
              rows={8}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-4 py-3 border border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 shadow-md"
              >
                Save
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-lg text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
            {content}
          </p>
        )}
      </section>

      <section className="flex justify-evenly items-center text-gray-600 dark:text-gray-400 text-sm border-t border-gray-300 dark:border-gray-600 pt-4">
        <div className="flex items-center gap-1 md:gap-3">
          <Button
            onClick={() => PostLikeMutation.mutate(_id)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-md"
          >
            <Heart
              className={`w-5 h-5 ${isLiked && "fill-current"} text-white`}
            />
          </Button>
          <p className=" font-normal md:font-medium text-gray-900 dark:text-gray-100">
            {likeCount} Likes
          </p>
        </div>
        {user && (
          <Button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition"
          >
            <MessageSquareQuote className="w-5 h-5" />
            <span className="hidden md:inline">Comments</span>
          </Button>
        )}
        <p className="text-sm italic">
          {formatDistanceToNow(new Date(createdAt))} ago
        </p>
      </section>

      {showComments && (
        <section className="mt-6 bg-gray-100 dark:bg-gray-800 p-2 md:p-4 rounded-lg shadow-inner">
          <Textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleAddComment}
            className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 shadow-md"
          >
            Submit Comment
          </Button>
          <CommentSection postId={_id} className="mt-4" />
        </section>
      )}
    </main>
  );
};

export default PostCard;
