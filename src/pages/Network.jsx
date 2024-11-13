import React from "react";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import ConnectionCard from "../components/ConnectionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Network = () => {
  const { toast } = useToast();

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
      toast({
        description: data.message || "Connections fetched successfully",
      });
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
      toast({
        description: data.message || " ConnectionsSent fetched successfully",
      });
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
      toast({
        description: data.message || " requests received fetched successfully",
      });
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  if (ConnectionsLoading && ConnectionSentLoading && RequestsLoading) {
    return <p>loading</p>;
  }
  if (ConnectionsError || ConnectionSentError || RequestsError) {
    return <p>error</p>;
  }

  //   console.log("Connections", Connections);
  console.log("Connections sent", ConnectionsSent);
  console.log("Connections Requests", Requests);

  return (
    <div className="mt-10 max-w-2xl mx-auto p-6 bg-white  rounded-xl shadow-lg">
      <Tabs defaultValue="Connections" className="w-full">
        <TabsList className="flex justify-around mb-6 bg-gray-200 rounded-lg p-2">
          <TabsTrigger
            value="RequestSent"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-colors hover:bg-blue-100 focus:bg-blue-200"
          >
            Request Sent
          </TabsTrigger>
          <TabsTrigger
            value="Connections"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-colors hover:bg-blue-100 focus:bg-blue-200"
          >
            Connections
          </TabsTrigger>
          <TabsTrigger
            value="Request Recieved"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-colors hover:bg-blue-100 focus:bg-blue-200"
          >
            Request Received
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

        <TabsContent value="Connections">
          <p className="text-2xl font-bold mb-4 text-gray-800">Network</p>
          {Connections?.data?.length === 0 ? (
            <p className="text-gray-600 text-center py-6">No Connections</p>
          ) : (
            <div className="space-y-4">
              {Connections?.data?.map((connection) => (
                <ConnectionCard key={connection?._id} connection={connection} />
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
