import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Edit } from "lucide-react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { toast } = useToast();
  const { userId } = useParams();
  const user = useSelector((state) => state.user.user);
  const isOwner = user?._id === userId;
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
  });
  const [experience, setExperience] = useState({
    position: "",
    company: "",
    startDate: "",
    endDate: "",
  });

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/user/profile/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      setHeadline(data.data.headline || "");
      setLocation(data.data.location || "");
      setSkills(data.data.skills?.join(", ") || "");
      setEducation(data.data.education || {});
      setExperience(data.data.experience || {});
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const updateProfile = useMutation(
    async (updates) => {
      return axiosInstance.put(`/user/profile/update`, updates);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["profile", userId]);
        toast({ description: "Profile updated successfully!" });
        setEditMode(false);
      },
      onError: (error) => {
        console.log("update error", error);
        toast({ description: "Failed to update profile." });
      },
    }
  );

  const handleSave = () => {
    const updates = {
      headline,
      location,
      skills: skills.split(",").map((skill) => skill.trim()),
      education,
      experience,
    };
    updateProfile.mutate(updates);
  };

  if (profileLoading) return <p>Loading...</p>;
  if (profileError) return <p>Error loading profile.</p>;

  const { fullname, avatar } = profile?.data;

  return (
    <div className="mt-10 max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <section className="flex items-center justify-center space-x-4 mb-6">
        <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 shadow-md">
          <AvatarImage src={avatar} />
          <AvatarFallback>{fullname[0]}</AvatarFallback>
        </Avatar>
        <div className="">
          <p className="text-2xl font-semibold">{fullname}</p>
          {editMode ? (
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="text-gray-500"
            />
          ) : (
            <p className="text-gray-500">{headline}</p>
          )}
          {editMode ? (
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-gray-400"
            />
          ) : (
            <p className="text-gray-400">{location}</p>
          )}
          <p className="text-blue-600 mt-2 font-medium">Connections</p>
          {isOwner && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center mt-2"
            >
              <Edit className="mr-1" /> Edit Profile
            </button>
          )}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Skills</h3>
        {editMode ? (
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Comma-separated skills"
            className="text-gray-600 mt-2"
          />
        ) : (
          <p className="text-gray-600">{skills}</p>
        )}
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Education</h3>
        {editMode ? (
          <>
            <input
              type="text"
              placeholder="Degree"
              value={education.degree}
              onChange={(e) =>
                setEducation({ ...education, degree: e.target.value })
              }
              className="text-gray-500 mt-1"
            />
            <input
              type="text"
              placeholder="Institution"
              value={education.institution}
              onChange={(e) =>
                setEducation({ ...education, institution: e.target.value })
              }
              className="text-gray-500 mt-1"
            />
          </>
        ) : (
          <>
            <p className="text-gray-500">{education?.degree}</p>
            <p className="text-gray-500">{education?.institution}</p>
          </>
        )}
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Experience</h3>
        {editMode ? (
          <>
            <input
              type="text"
              placeholder="Position"
              value={experience.position}
              onChange={(e) =>
                setExperience({ ...experience, position: e.target.value })
              }
              className="text-gray-500 mt-1"
            />
            <input
              type="text"
              placeholder="Company"
              value={experience.company}
              onChange={(e) =>
                setExperience({ ...experience, company: e.target.value })
              }
              className="text-gray-500 mt-1"
            />
          </>
        ) : (
          <>
            <p className="text-gray-500">{experience?.position}</p>
            <p className="text-gray-500">{experience?.company}</p>
          </>
        )}
      </section>

      {editMode && (
        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default Profile;
