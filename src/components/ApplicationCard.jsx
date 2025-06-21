import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const ApplicationCard = ({ application }) => {
  

  const { _id, createdAt, resume, applicant } = application;
  const { fullname, headline, email, avatar } = applicant;

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-lg overflow-hidden md:p-6 lg:p-8 gap-5 max-w-4xl border-b-2 border-b-black mb-5 transition-transform transform hover:scale-105">
      <section className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/3 space-y-4">
        <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-blue-500">
          <AvatarImage
            src={avatar?.url}
            alt="Avatar"
            className="rounded-full"
          />
          <AvatarFallback className="bg-gray-300 text-gray-700">
            {fullname[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            <Link
              to={`/profile/${applicant?._id}`}
              className="hover:text-blue-600 hover:underline"
            >
              {fullname}
            </Link>
          </p>
          <p className="text-sm text-gray-600">{headline}</p>
          <p className="flex gap-2 font-semibold text-gray-950">
            Contact:
            <span className="font-medium underline text-blue-600">{email}</span>
          </p>
        </div>
      </section>

      <div className="flex justify-center lg:w-1/3">
        <Link to={resume?.url} target="_blank">
          <img
            src={resume?.url}
            alt="Resume"
            className="w-full h-auto max-h-72 rounded-lg border shadow-md object-cover hover:shadow-xl transition-shadow duration-300"
          />
        </Link>
      </div>

      <section className="flex flex-col items-center lg:items-start lg:w-1/3 space-y-2">
        <p className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </section>
    </div>
  );
};

export default ApplicationCard;
