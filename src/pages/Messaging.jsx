import React from "react";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Messaging = () => {
  const {
    data: connections,
    isLoading: connectionsLoading,
    isError: connectionsError,
  } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const response = await axiosInstance.get("/connection/connections");
      return response.data;
    },
  });

  if (connectionsLoading) {
    return <p>Loading...</p>;
  }
  //   console.log("connections", connections);

  return (
    <main className="p-6 bg-gray-50 min-h-screen my-7 ">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Conversations
        </h2>

        {connections?.data?.length > 0 ? (
          connections?.data?.map((connection) => (
            <section
              key={connection?.connectionId}
              className="flex items-center justify-between p-4 mb-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
                  <AvatarImage src={connection?.avatar} />
                  <AvatarFallback className="text-xl font-semibold">
                    {connection?.fullname[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {connection?.fullname}
                  </p>
                  <p>{connection?.headline}</p>
                  <p className="text-sm text-gray-500">{connection?.status}</p>
                </div>
              </div>

              <Link
                to={`/conversation/${connection?.nextUserId}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
              >
                Message
              </Link>
            </section>
          ))
        ) : (
          <div className="text-lg text-gray-600 text-center mt-6">
            <p className="font-semibold my-5 text-gray-800">
              No connections yet!
            </p>
            <span>Start </span>
            <Link
              to="/network"
              className="text-blue-500 font-semibold hover:text-blue-600 transition-all ease-in-out duration-300"
            >
              exploring and connect
            </Link>
            <span>
              {" "}
              with amazing developers to kickstart your conversations!
            </span>
          </div>
        )}
      </div>
    </main>
  );
};

export default Messaging;
