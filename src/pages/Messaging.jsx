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
    <main className="px-2 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen my-7">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Conversations
        </h2>

        {connections?.data?.length > 0 ? (
          connections?.data?.map((connection) => (
            <section
              key={connection?.connectionId}
              className="flex items-center justify-between px-2 py-4 md:px-4 mb-4 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <Avatar className=" md:w-14 md:h-14 rounded-full border-4 border-gradient-to-r from-indigo-400 to-blue-500 shadow-lg">
                  <AvatarImage src={connection?.avatar} />
                  <AvatarFallback className="md:text-2xl font-semibold text-gray-700">
                    {connection?.fullname[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {connection?.fullname}
                  </p>
                  <p className="text-sm text-gray-600">
                    {connection?.headline}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    {connection?.status}
                  </p>
                </div>
              </div>

              <Link
                to={`/conversation/${connection?.nextUserId}`}
                className="px-2 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
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
              exploring and connecting
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
