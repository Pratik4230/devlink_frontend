import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { LoaderPinwheel } from "lucide-react";
import { Link } from "react-router-dom";
const UserCard = ({ user }) => {
  //   console.log(user);

  const { avatar, fullname, headline, education, _id } = user;
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const sendConnection = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/connection/send/${_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["usersFeed"]);
      queryClient.invalidateQueries(["ConnectionsSent"]);
      toast({
        description: data.message || "Connection sent successfully",
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
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 flex flex-col items-center  space-x-4">
      <section>
        <Avatar className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {fullname[0]}
          </AvatarFallback>
        </Avatar>
      </section>

      <div className="flex my-2 flex-col items-center  ">
        <section className="flex mb-2 flex-col items-center space-y-1">
          <Link to={`/profile/${_id}`}>
            {" "}
            <p className="text-lg  font-semibold text-gray-800 dark:text-white">
              {fullname}
            </p>{" "}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">{headline}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
            {education?.institution}
          </p>
        </section>

        <Button
          className="bg-gradient-to-r mt-2 from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring focus:ring-purple-300 active:bg-blue-700 px-3 py-2 rounded-lg text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => sendConnection.mutate()}
          disabled={sendConnection.isLoading}
        >
          {sendConnection.isLoading ? (
            <LoaderPinwheel className=" animate-spin " />
          ) : (
            "Connect"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
