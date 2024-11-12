import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquareQuote } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentSection from "./CommentSection";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PostCatd = ({ post }) => {
  // console.log("post", post);

  const { author, content, createdAt, isLiked, likeCount, _id } = post;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
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
      <section className="mb-6">
        <p className="text-gray-700 px-6 dark:text-gray-300 text-lg">
          {content}
        </p>
      </section>
      <section className="flex justify-evenly items-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="flex items-center space-x-3 ">
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm">
            <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </button>
          <p className="text-gray-800 dark:text-gray-100 font-medium">
            {likeCount} Likes
          </p>
        </div>

        <p className="text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(createdAt))} ago
        </p>
      </section>
      <Collapsible>
        <CollapsibleTrigger>
          <p className="cursor-pointer">
            <MessageSquareQuote />
          </p>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CommentSection postId={_id} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PostCatd;
