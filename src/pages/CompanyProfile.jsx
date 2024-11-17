import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance.js";
import { toast } from "../hooks/use-toast";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: company,
    isLoading: companyLoading,
    isError: companyError,
  } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/company/profile/${companyId}`);
      return response.data;
    },
    onSuccess: (data) => {
      // toast({
      //   description: data.message || "company profile fetched successfully",
      // });
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    },
  });

  const {
    about,
    bio,
    companyName,
    companySize,
    website,
    _id,
    locations,
    logo,
  } = company?.data || {};

  const [formData, setFormData] = useState({
    bio: bio || "",
    about: about || "",
    companySize: companySize || "",
    website: website || "",
    locations: locations?.join(", ") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateMutation = useMutation({
    mutationFn: async (Data) => {
      const response = await axiosInstance.put(`/company/update`, Data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["company"]);
      toast({
        description: data.message || "company profile updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    },
  });

  const handleSubmit = async () => {
    const updatedData = {
      ...formData,
      locations: formData.locations.split(",").map((loc) => loc.trim()),
    };
    console.log("updatedData", updatedData);
    updateMutation.mutate(updatedData);
  };

  if (companyLoading) {
    return <p>loading company profile</p>;
  }

  console.log("company", company);

  return (
    <main className="mt-6 p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <section className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
          <Avatar className="w-14  h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
            <AvatarImage src={logo} />
            <AvatarFallback>{companyName?.[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {companyName}
          </h1>
          {isEditing ? (
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-2 block w-full border rounded-md p-2"
              placeholder="Enter bio"
            />
          ) : (
            <p className="text-gray-500 mt-2">{bio}</p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          About the Company
        </h2>
        {isEditing ? (
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="Enter about information"
          />
        ) : (
          <p className="text-gray-600">{about || "No details available."}</p>
        )}
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Company Details
          </h2>
          <p className="font-medium">
            Company Size:
            {isEditing ? (
              <input
                type="text"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="ml-2 border rounded-md p-1"
                placeholder="Enter company size"
              />
            ) : (
              <span className="font-normal"> {companySize} </span>
            )}
          </p>
          <p className="font-medium">
            Website:
            {isEditing ? (
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="ml-2 border rounded-md p-1"
                placeholder="Enter website URL"
              />
            ) : (
              <span className="font-normal"> {website} </span>
            )}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Locations
          </h2>
          {isEditing ? (
            <input
              type="text"
              name="locations"
              value={formData.locations}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter locations separated by commas"
            />
          ) : locations?.length > 0 ? (
            <p>{locations.join(", ")}</p>
          ) : (
            <p>No locations available</p>
          )}
        </div>
      </section>

      <div className="mt-8 flex space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={updateMutation?.isLoading}
              className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ${
                updateMutation?.isLoading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {updateMutation?.isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Edit Details
          </button>
        )}
      </div>

      <section className="mt-8">
        <Tabs defaultValue="posts" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">Posts</TabsContent>
          <TabsContent value="jobs">Jobs</TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default CompanyProfile;
