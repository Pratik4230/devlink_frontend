import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Comment = ({ comment }) => {
  console.log("c", comment);
  const { content, _id, createdAt, isLiked, likeCount } = comment;
  const { fullname, headline, avatar } = comment?.users;

  return (
    <div>
      <section>
        <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
          <AvatarImage src={avatar} />
          <AvatarFallback>{fullname[0]}</AvatarFallback>
        </Avatar>

        <div>
          <p>{fullname}</p>
          <p>{headline}</p>
        </div>
      </section>

      <p>{content}</p>

      <p>{likeCount}</p>
    </div>
  );
};

export default Comment;
