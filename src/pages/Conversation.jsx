import React, { useState } from "react";

import { axiosInstance } from "../utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoveLeft, Trash } from "lucide-react";

const Conversation = () => {
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();

  const { receiverId } = useParams();

  //   console.log("receiverId", receiverId);

  const loggedInUserId = useSelector((state) => state?.user?.user?._id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["conversation", receiverId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/message/conversation/${receiverId}`
      );
      return response.data;
    },
    enabled: !!receiverId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }) => {
      const response = await axiosInstance.post(`/message/send/${receiverId}`, {
        content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversation", receiverId]);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      const response = await axiosInstance.delete(
        `/message/delete/${messageId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversation", receiverId]);
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate({ receiverId, content: newMessage });
    setNewMessage("");
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessageMutation.mutate(messageId);
  };

  if (isLoading) {
    return <p>Loading conversation...</p>;
  }

  if (error) {
    return (
      <p>Error: {error.response?.data?.message || "Something went wrong"}</p>
    );
  }

  if (!data || !data.data || data.data?.messages.length == 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              Let's start the conversation!
            </h3>
            <p className="text-gray-500 mt-2">
              Share your thoughts and send a message.
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-md border-t">
            <div className="flex items-center space-x-4">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Button
                onClick={() => {
                  handleSendMessage(newMessage);
                  setNewMessage("");
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-all"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //   console.log("data", data);

  const { participants, messages } = data.data;

  return (
    <main className="flex justify-center">
      <div className=" my-5 bg-red-50 w-full p-1 md:w-8/12 lg:w-6/12 ">
        <div className=" bg-gray-200 flex relative items-center justify-around p-4">
          <Link to="/messaging" className="absolute left-4">
            <MoveLeft className="cursor-pointer " size={36} />{" "}
          </Link>
          {participants[0]._id.toString() == loggedInUserId.toString()
            ? participants[1].fullname
            : participants[0].fullname}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex mb-4 ${
                  message.sender._id === loggedInUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                    message.sender._id === loggedInUserId
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p className="font-semibold">{message.sender.fullname}</p>
                  <p>{message.content}</p>
                  {message.sender._id === loggedInUserId && (
                    <button
                      onClick={() => handleDeleteMessage(message._id)}
                      className="mt-1 flex justify-self-end  p-1 rounded-md bg-slate-100  text-red-600 hover:underline"
                    >
                      <Trash size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex items-center space-x-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-md resize-none focus:outline-none"
              />
              <Button
                onClick={() => {
                  handleSendMessage(newMessage);
                  setNewMessage("");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Conversation;
