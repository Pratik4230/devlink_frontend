import { LoaderPinwheel, ShieldCheck, ShieldX, Trash2, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const ConnectionCard = ({ connection, type }) => {
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

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const RemoveConnection = useMutation({
    mutationFn: async (ID) => {
      const response = await axiosInstance.delete(`/connection/remove/${ID}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["ConnectionsSent"]);
      queryClient.invalidateQueries(["usersFeed"]);
      queryClient.invalidateQueries(["Connections"]);
      toast({
        description: data.message || "Connection removed successfully",
      });
    },
  });

  const rejectConnection = useMutation({
    mutationFn: async (ID) => {
      const response = await axiosInstance.put(`/connection/reject/${ID}`);
      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(["Requests"]);
      queryClient.invalidateQueries(["usersFeed"]);
      toast({
        description: data.message || "Connection rejected successfully",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    },
  });

  const acceptConnection = useMutation({
    mutationFn: async (ID) => {
      console.log("accept," + ID);

      const response = await axiosInstance.put(`/connection/accept/${ID}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Connections"]);
      queryClient.invalidateQueries(["Requests"]);
      console.log("accept success", data);
      toast({
        description: data.message || "Connection accepted successfully",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    },
  });

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-2xl mt-10 space-x-6 transition-colors duration-300">
      <section className="flex items-center space-x-4 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md">
        {" "}
        <Avatar className="w-16 h-16 rounded-full border-4 border-gray-300 dark:border-indigo-700 shadow-lg text-3xl font-bold">
          <AvatarImage src={avatar} />
          <AvatarFallback>{fullname[0]}</AvatarFallback>
        </Avatar>{" "}
        <div>
          <Link to={`/profile/${nextUserId}`}>
            {" "}
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {fullname}
            </p>
            <p className="text-md text-gray-700 dark:text-indigo-200">
              {headline}
            </p>
          </Link>
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
          <Button
            className="flex items-center justify-center p-5 text-xl font-semibold bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white rounded-full shadow-md transition duration-200 ease-in-out"
            onClick={() => RemoveConnection.mutate(connectionId)}
            disabled={RemoveConnection.isLoading}
          >
            {RemoveConnection.isLoading ? (
              <LoaderPinwheel className="animate-spin" />
            ) : (
              <span className="px-2">Remove</span>
            )}{" "}
          </Button>
        )}

        {status === "pending" && type == "received" && (
          <div className="flex flex-col gap-2">
            <Button
              className="flex items-center justify-center p-5 text-xl font-semibold bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-full shadow-md transition duration-200 ease-in-out"
              onClick={() => acceptConnection.mutate(connectionId)}
              disabled={acceptConnection.isLoading}
            >
              {acceptConnection.isLoading ? (
                <LoaderPinwheel className=" animate-spin" />
              ) : (
                <span className="px-2"> Accept</span>
              )}
            </Button>
            <Button
              className="flex items-center justify-center  p-5 text-xl font-semibold bg-red-500 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500 text-white rounded-full shadow-md transition duration-200 ease-in-out"
              onClick={() => rejectConnection.mutate(connectionId)}
              disabled={rejectConnection.isLoading}
            >
              {rejectConnection.isLoading ? (
                <LoaderPinwheel className=" animate-spin" />
              ) : (
                <span className="px-2"> Reject</span>
              )}
            </Button>
          </div>
        )}

        {status === "pending" && type == "sent" && (
          <div className="flex flex-col gap-2">
            <Button
              className="flex items-center justify-center  p-5 text-xl font-semibold bg-red-500 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500 text-white rounded-full shadow-md transition duration-200 ease-in-out"
              onClick={() => RemoveConnection.mutate(connectionId)}
              disabled={RemoveConnection.isLoading}
            >
              {RemoveConnection.isLoading ? (
                <LoaderPinwheel className=" animate-spin" />
              ) : (
                <span className=" p-3  flex items-center">Cancel</span>
              )}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ConnectionCard;
