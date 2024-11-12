import { ShieldCheck, ShieldX, Trash2, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ConnectionCard = ({ connection }) => {
  //   console.log("hii", connection);

  const {
    status,
    nextUserId,
    createdAt,
    connectionId,
    avatar,
    fullname,
    headline,
  } = connection;
  //   const { avatar, fullname, headline } = connection?.connectedTo;

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-2xl mt-10 space-x-6 transition-colors duration-300">
      <section className="flex items-center space-x-4 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md">
        {" "}
        <Avatar className="w-16 h-16 rounded-full border-4 border-gray-300 dark:border-indigo-700 shadow-lg text-3xl font-bold">
          <AvatarImage src={avatar} />
          <AvatarFallback>{fullname[0]}</AvatarFallback>
        </Avatar>{" "}
        <div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {fullname}
          </p>
          <p className="text-md text-gray-700 dark:text-indigo-200">
            {headline}
          </p>
          <p className="text-sm text-gray-600 dark:text-indigo-300 mt-1">
            {status}
          </p>
          <p className="text-xs text-gray-500 dark:text-indigo-400 mt-1">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="flex items-center space-x-3 p-2">
        {status === "connected" && (
          <button className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white rounded-full shadow-md transition duration-200 ease-in-out">
            <Trash2 />
          </button>
        )}

        {status === "pending" && (
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-full shadow-md transition duration-200 ease-in-out">
              <ShieldCheck />
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500 text-white rounded-full shadow-md transition duration-200 ease-in-out">
              <ShieldX />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ConnectionCard;
