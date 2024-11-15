import React from "react";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCatd from "../components/PostCatd";
import { Edit, EllipsisVertical } from "lucide-react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { toast } = useToast();

  const { userId } = useParams();
  // console.log(userId);

  const user = useSelector((state) => state.user.user);

  const isOwner = user?._id === userId;

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/user/profile/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      // toast({ description: data.message || "profile fetched successfully" });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/post/user/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      // toast({ description: data.message || "posts fetched successfully" });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  if (profileLoading) {
    return <p>loading</p>;
  }

  if (profileError) {
    return <p>error</p>;
  }

  if (postsLoading) {
    return <p>loading</p>;
  }

  // console.log("profile", profile.data);

  const {
    createdAt,
    education,
    experience,
    _id,
    email,
    fullname,
    headline,
    location,
    skills,
    avatar,
  } = profile?.data;

  return (
    <div className="mt-10 max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <section className="flex items-center justify-center space-x-4 mb-6">
        <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
          <AvatarImage src={avatar} />
          <AvatarFallback>{fullname[0]}</AvatarFallback>
        </Avatar>
        <div className="">
          <p className="text-2xl font-semibold">{fullname}</p>
          <p className="text-gray-500 flex  ">{headline}</p>
          <p className="text-gray-400 flex ">{location}</p>
          <p className="text-blue-600 mt-2 font-medium">Connections</p>
        </div>
      </section>

      <section className="mb-6 flex flex-col items-center">
        <h3 className="text-lg flex font-semibold text-gray-700 mb-2">
          Skills
        </h3>
        <p className="text-gray-600 font-semibold text-lg ">
          {skills
            ?.map((skill) => skill)
            .join(", ")
            .toUpperCase()}
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700  flex mb-2">
          Experience
        </h3>
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold flex text-gray-700 mb-1">
            Education
          </h4>
          <p className="text-gray-500">{education?.degree}</p>
          <p className="text-gray-500">{education?.institution}</p>
          <p className="text-gray-400">
            {education?.startDate} - {education?.endDate}
          </p>
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Activity</h3>
        <p className="text-blue-600 font-medium">Posts</p>
        <div>
          {!posts || posts?.data?.length == 0 ? (
            <p className="text-gray-500">No posts found</p>
          ) : (
            posts?.data?.map((post) => <PostCatd key={post._id} post={post} />)
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
