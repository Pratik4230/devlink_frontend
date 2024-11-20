import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCatd from "../components/PostCatd";
import { Edit, EllipsisVertical } from "lucide-react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { toast } = useToast();

  const { userId } = useParams();
  // console.log(userId);

  const company = useSelector((state) => state.company.company);

  const [editMode, setEditMode] = useState(false);
  const [Headline, setHeadline] = useState("");
  const [Location, setLocation] = useState("");
  const [Skills, setSkills] = useState([]);
  const [Education, setEducation] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
  });
  const [Experience, setExperience] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
  });

  const user = useSelector((state) => state.user.user);
  const queryClient = useQueryClient();
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
      const { education, experience, headline, location, skills, avatar } =
        data?.data;

      setHeadline(headline);
      setLocation(location);
      setSkills(skills);
      setEducation(education);
      setExperience(experience);
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

  const profileUpdateMutation = useMutation({
    mutationFn: async (updatedFields) => {
      const response = await axiosInstance.put(`/user/update`, updatedFields);
      // console.log("response", response);

      return response.data;
    },
    onSuccess: (data) => {
      // console.log("data", data);

      setTimeout(() => {
        queryClient.invalidateQueries(["profile"]);
      }, 500);
      toast({ description: data?.message || "profile updated successfully" });
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    },
  });

  // console.log("profile", profile.data);
  if (profileLoading) {
    return <p>loading</p>;
  }

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

  if (profileError) {
    return <p>error</p>;
  }

  if (postsLoading) {
    return <p>loading</p>;
  }

  const updateFields = {};

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (Headline) updateFields.headline = Headline;
    if (Location) updateFields.location = Location;
    if (Skills) updateFields.skills = Skills;
    if (Education) updateFields.education = Education;
    if (Experience) updateFields.experience = Experience;

    // console.log("updateFields", updateFields);

    profileUpdateMutation.mutate(updateFields);

    setEditMode(false);
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <section className="flex items-center justify-center space-x-4 mb-6 relative ">
        <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
          <AvatarImage src={avatar} />
          <AvatarFallback>{fullname[0]}</AvatarFallback>
        </Avatar>
        <div className="">
          <p className="text-2xl font-semibold">{fullname}</p>
          <p className="text-gray-500 flex  ">
            {editMode ? (
              <Input
                className="bg-gray-100 px-2 py-1 rounded-md"
                type="text"
                value={Headline}
                placeholder="Enter your headline"
                onChange={(e) => setHeadline(e.target.value)}
              />
            ) : (
              headline
            )}
          </p>
          <p className="text-gray-400 flex my-2 ">
            {editMode ? (
              <Input
                className="bg-gray-100 px-2 py-1 rounded-md"
                type="text"
                value={Location}
                placeholder="Enter your location"
                onChange={(e) => setLocation(e.target.value)}
              />
            ) : (
              location
            )}
          </p>
          {company && <p className="text-blue-600 mt-2 font-medium">{email}</p>}
        </div>

        {isOwner && (
          <Edit
            onClick={() => setEditMode(!editMode)}
            className="absolute top-2 right-5 cursor-pointer"
          >
            {" "}
          </Edit>
        )}
      </section>

      <section className="mb-6 flex flex-col items-center">
        <h3 className="text-lg flex font-semibold text-gray-700 mb-2">
          Skills
        </h3>
        <p className="text-gray-600 font-semibold text-lg ">
          {editMode ? (
            <Textarea
              cols={30}
              className="bg-gray-100 px-2 py-1 rounded-md"
              type="text"
              value={Skills}
              placeholder="Enter your skills ex. HTML, CSS, JS"
              onChange={(e) => setSkills(e.target.value.split(", "))}
            />
          ) : (
            skills?.join(", ").toUpperCase()
          )}
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700  flex mb-2">
          Experience
        </h3>
        {editMode ? (
          <div>
            <Input
              className="bg-gray-100 px-2 py-1 my-1 rounded-md"
              type="text"
              value={Experience?.jobTitle}
              placeholder="Enter your JobTitle"
              onChange={(e) =>
                setExperience({ ...Experience, jobTitle: e.target.value })
              }
            />
            <Input
              className="bg-gray-100 px-2 py-1 my-1  rounded-md"
              type="text"
              value={Experience?.company}
              placeholder="Enter your company"
              onChange={(e) =>
                setExperience({ ...Experience, company: e.target.value })
              }
            />
            <Input
              className="bg-gray-100 px-2 py-1 my-1  rounded-md"
              type="text"
              value={Experience?.startDate}
              placeholder="Enter your start date"
              onChange={(e) =>
                setExperience({ ...Experience, startDate: e.target.value })
              }
            />
            <Input
              className="bg-gray-100 px-2 py-1 my-1  rounded-md"
              type="text"
              value={Experience?.endDate}
              placeholder="Enter your end date"
              onChange={(e) =>
                setExperience({ ...Experience, endDate: e.target.value })
              }
            />
          </div>
        ) : (
          <div className="border-t pt-4" key={experience?._id}>
            <p className="text-gray-500">{experience?.jobTitle}</p>
            <p className="text-gray-500">{experience?.company}</p>
            <p className="text-gray-400">
              {experience?.startDate} - {experience?.endDate}
            </p>
          </div>
        )}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold flex text-gray-700 mb-1">
            Education
          </h4>

          {editMode ? (
            <div>
              <Input
                className="bg-gray-100 px-2 py-1 my-1  rounded-md"
                type="text"
                value={Education?.degree}
                placeholder="Enter your degree"
                onChange={(e) =>
                  setEducation({ ...Education, degree: e.target.value })
                }
              />
              <Input
                className="bg-gray-100 px-2 py-1 my-1  rounded-md"
                type="text"
                value={Education?.institution}
                placeholder="Enter your institution"
                onChange={(e) =>
                  setEducation({ ...Education, institution: e.target.value })
                }
              />
              <Input
                className="bg-gray-100 px-2 py-1 my-1  rounded-md"
                type="text"
                value={Education?.startDate}
                placeholder="Enter your start date"
                onChange={(e) =>
                  setEducation({ ...Education, startDate: e.target.value })
                }
              />
              <Input
                className="bg-gray-100 px-2 py-1 my-1  rounded-md"
                type="text"
                value={Education?.endDate}
                placeholder="Enter your end date"
                onChange={(e) =>
                  setEducation({ ...Education, endDate: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="border-t pt-4" key={education?._id}>
              <p className="text-gray-500">{education?.degree}</p>
              <p className="text-gray-500">{education?.institution}</p>
              <p className="text-gray-400">
                {education?.startDate} - {education?.endDate}
              </p>
            </div>
          )}
        </div>

        {editMode && (
          <div className="flex justify-end mt-4">
            <Button onClick={(e) => handleProfileUpdate(e)}>
              Update Profile
            </Button>
          </div>
        )}
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
