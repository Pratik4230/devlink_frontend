import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import ConnectionCard from "../components/ConnectionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import UserCard from "../components/UserCard";

const Network = () => {
  const { toast } = useToast();

  const {
    data: usersFeed,
    isLoading: usersFeedLoading,
    isError: usersFeedError,
  } = useQuery({
    queryKey: ["usersFeed"],
    queryFn: async () => {
      const response = await axiosInstance.get("/connection/feed");
      return response.data;
    },
    onSuccess: (data) => {
      // toast({
      //   description: data.message || "usersFeed fetched successfully",
      // });
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const {
    data: Connections,
    isLoading: ConnectionsLoading,
    isError: ConnectionsError,
  } = useQuery({
    queryKey: ["Connections"],
    queryFn: async () => {
      const response = await axiosInstance.get("/connection/connections");
      return response.data;
    },
    onSuccess: (data) => {
      // toast({
      //   description: data.message || "Connections fetched successfully",
      // });
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const {
    data: ConnectionsSent,
    isLoading: ConnectionSentLoading,
    isError: ConnectionSentError,
  } = useQuery({
    queryKey: ["ConnectionsSent"],
    queryFn: async () => {
      const response = await axiosInstance.get("/connection/requestssent");
      return response.data;
    },
    onSuccess: (data) => {
      // toast({
      //   description: data.message || " ConnectionsSent fetched successfully",
      // });
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const {
    data: Requests,
    isLoading: RequestsLoading,
    isError: RequestsError,
  } = useQuery({
    queryKey: ["Requests"],
    queryFn: async () => {
      const response = await axiosInstance.get("/connection/requestsreceived");
      return response.data;
    },
    onSuccess: (data) => {
      // toast({
      //   description: data.message || " requests received fetched successfully",
      // });
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  if (
    ConnectionsLoading &&
    ConnectionSentLoading &&
    RequestsLoading &&
    usersFeedLoading
  ) {
    return <p>loading</p>;
  }
  if (
    ConnectionsError ||
    ConnectionSentError ||
    RequestsError ||
    usersFeedError
  ) {
    return <p>error</p>;
  }

  // console.log("Connections", Connections);
  // console.log("Connections sent", ConnectionsSent);
  // console.log("Connections Requests", Requests);
  // console.log("usersFeed", usersFeed);

  // console.log("searchUsers", searchUsers?.data);

  return (
    <div className="my-10 max-w-2xl mx-auto p-2 md:p-6 bg-white rounded-xl shadow-xl border border-gray-200">
      <Tabs defaultValue="Explore" className="w-full">
        <TabsList className="flex md:flex-wrap items-center justify-around mb-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg  md:px-2 py-6 shadow-md">
          <TabsTrigger
            value="RequestSent"
            className=" px-2  md:px-4  py-2 flex rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Sent
          </TabsTrigger>
          <TabsTrigger
            value="Explore"
            className=" px-2 md:px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
          >
            Explore
          </TabsTrigger>
          <TabsTrigger
            value="Connections"
            className="px-2 md:px-4 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Connections
          </TabsTrigger>
          <TabsTrigger
            value="Request Recieved"
            className="px-2 md:px-4 py-2  rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
          >
            Received
          </TabsTrigger>
        </TabsList>

        <TabsContent value="RequestSent">
          <p className="text-2xl font-bold mb-4 text-gray-800">
            Connections Sent
          </p>
          {ConnectionsSent?.data?.length === 0 ? (
            <p className="text-gray-600 text-center py-6">
              No Connections Sent
            </p>
          ) : (
            <div className="space-y-4">
              {ConnectionsSent?.data?.map((connection) => (
                <ConnectionCard
                  key={connection?._id}
                  connection={connection}
                  type={"sent"}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="Explore">
          <p className="text-2xl font-bold mb-4 text-gray-800">Explore</p>
          {usersFeed?.data?.length === 0 ? (
            <p className="text-gray-600 text-center py-6">No Users Yet</p>
          ) : (
            <div className="space-y-4">
              {usersFeed?.data?.map((user) => (
                <UserCard key={user?._id} user={user} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="Connections">
          <p className="text-2xl font-bold mb-4 text-gray-800">Network</p>
          {Connections?.data?.length === 0 ? (
            <p className="text-gray-600 text-center py-6">No Connections</p>
          ) : (
            <div className="space-y-4">
              {Connections?.data?.map((connection) => (
                <ConnectionCard
                  key={connection?.connectionId}
                  connection={connection}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="Request Recieved">
          <p className="text-2xl font-bold mb-4 text-gray-800">
            Requests Received
          </p>
          {Requests?.data?.length === 0 ? (
            <p className="text-gray-600 text-center py-6">
              No Requests Received
            </p>
          ) : (
            <div className="space-y-4">
              {Requests?.data?.map((connection) => (
                <ConnectionCard
                  key={connection?._id}
                  connection={connection}
                  type={"received"}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Network;
