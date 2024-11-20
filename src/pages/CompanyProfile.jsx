import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance.js";
import { toast } from "../hooks/use-toast";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobCard from "../components/JobCard";
import { LoaderPinwheel, UserCheck, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const user = useSelector((state) => state.user.user);

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
    isFollowing,
  } = company?.data || {};

  const [formData, setFormData] = useState({
    bio: bio || "",
    about: about || "",
    companySize: companySize || "",
    website: website || "",
    locations: locations?.join(", ") || "",
  });

  const {
    data: companyJobs,
    isLoading: companyJobsLoading,
    isError: companyJobsError,
  } = useQuery({
    queryKey: ["companyJobs", _id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/job/company/${companyId}`);
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
    data: followers,
    isLoading: followersLoading,
    isError: followersError,
  } = useQuery({
    queryKey: ["followers", _id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/follow/followers/${_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      // toast({
      //   description: data.message ",
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

  const followMutation = useMutation({
    mutationFn: async (companyID) => {
      console.log("companyID", companyID);

      const response = await axiosInstance.post(`/follow/company/${companyID}`);
      return response.data;
    },
    onSuccess: (data) => {
      // console.log(data);

      queryClient.invalidateQueries(["company"]);
      toast({
        description: data.message || "company followed successfully",
      });
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
    // console.log("updatedData", updatedData);
    updateMutation.mutate(updatedData);
  };

  if (companyLoading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg font-medium">
        loading company profile
      </p>
    );
  }

  // console.log("company", company);
  // console.log("companyJobs", companyJobs);
  // console.log("followers", followers);

  return (
    <main className="mt-6 p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <section className="flex flex-col  items-center  relative ">
        <div className="">
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
        {user && (
          <p
            onClick={() => followMutation.mutate(_id)}
            className="absolute top-2 right-2 border-2 border-orange-400 px-3 py-1 rounded-lg text-blue-600 font-medium text-base cursor-pointer transition duration-200 ease-in-out hover:bg-blue-600 hover:text-white hover:shadow-lg"
          >
            {isFollowing ? (
              <UserCheck className="w-5 h-5" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
          </p>
        )}
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
        <Tabs defaultValue="followers" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="followers">
            {followersLoading && (
              <LoaderPinwheel className="animate-spin text-blue-600" />
            )}
            {!followers?.data || followers?.data?.length == 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg font-medium">
                No followers available
              </p>
            ) : (
              followers?.data?.map((follower) => (
                <div
                  key={follower?._id}
                  className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out max-w-xs text-center"
                >
                  <Avatar className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md mb-4">
                    <AvatarImage src={follower?.Follower?.avatar?.url} />
                    <AvatarFallback className="bg-gray-200 text-gray-800 font-semibold">
                      {follower?.Follower?.fullname?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <Link to={`/profile/${follower?.Follower?._id}`}>
                    {" "}
                    <p className="text-lg font-semibold hover:text-blue-600 text-gray-800">
                      {follower?.Follower?.fullname}
                    </p>{" "}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {follower?.Follower?.headline}
                  </p>
                  <p className="text-sm text-gray-500">
                    {follower?.Follower?.location}
                  </p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="jobs">
            {companyJobsLoading && (
              <LoaderPinwheel className="animate-spin text-blue-600" />
            )}
            {!companyJobs?.data || companyJobs?.data?.length == 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg font-medium">
                No jobs available
              </p>
            ) : (
              companyJobs?.data?.map((job) => (
                <JobCard key={job?._id} job={job} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default CompanyProfile;
