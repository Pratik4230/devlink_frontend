import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Dot, Eye, EyeOff, LoaderPinwheel, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  // console.log("1 job", job);
  const [file, setFile] = useState(null);
  //   companyName, companySize, locations, website,
  let isOwner = false;
  const LoggedInCompany = useSelector((state) => state.company.company);
  const queryClient = useQueryClient();

  const {
    logo,
    company,
    createdAt,
    description,
    location,
    maxSalary,
    minSalary,
    requirements,
    skills,
    status,
    title,
    type,
    updatedAt,
    _id,
  } = job;

  if (LoggedInCompany) {
    // console.log(company?._id?.toString() == LoggedInCompany?._id?.toString());

    if (company?._id?.toString() == LoggedInCompany?._id?.toString()) {
      isOwner = true;
    }
  }

  const { companyName, bio, companySize, website } = company;

  const deleteJobMutation = useMutation({
    mutationFn: async (ID) => {
      const response = await axiosInstance.delete(`/job/delete/${ID}`);
      return response.data;
    },
    onSuccess: (data) => {
      // console.log("sucess", data);
      queryClient.invalidateQueries(["companyJobs", LoggedInCompany?._id]);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (ID) => {
      const response = await axiosInstance.put(`/job/status/${ID}`);
      return response.data;
    },
    onSuccess: (data) => {
      // console.log("sucess", data);
      queryClient.invalidateQueries(["companyJobs", LoggedInCompany?._id]);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const uploadResumeMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        `/jobapplication/apply/${jobId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      alert("Resume uploaded successfully!");
      // console.log("Success:", data);
      setFile(null);
    },
    onError: (error) => {
      alert("Failed to upload resume. Please try again.");
      console.error("Upload error:", error);
    },
  });

  const handleApply = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    uploadResumeMutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const jobId = _id;

  return (
    <main className="container mx-auto my-6 px-3 py-6 lg:px-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-lg max-w-3xl border border-gray-300 dark:border-gray-700">
      <div className="space-y-6">
        <section className="flex items-center relative space-x-4">
          <Avatar className="w-16 h-16 rounded-full border-2 border-indigo-500 dark:border-teal-500 shadow-lg hover:shadow-2xl transition-shadow">
            <AvatarImage src={logo} />
            <AvatarFallback className="bg-indigo-500 text-white font-bold">
              {companyName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link to={`/company/${company?._id}`}>
              <p className="text-lg md:text-2xl lg:text-3xl font-bold hover:text-indigo-600 dark:hover:text-teal-400 text-gray-800 dark:text-white transition-colors">
                {companyName}
              </p>
            </Link>
            <p className="text-sm font-light text-gray-600 dark:text-gray-400">
              {title}
            </p>
          </div>

          {isOwner && (
            <div className="absolute top-0 right-0 flex flex-col items-center gap-2">
              <Trash
                onClick={() => deleteJobMutation.mutate(_id)}
                className="cursor-pointer text-red-600 hover:text-red-800 transition-transform transform hover:scale-110"
              />
              <Button
                onClick={() => statusMutation.mutate(_id)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-md shadow hover:shadow-lg"
              >
                {status === "active" ? <Eye /> : <EyeOff />}
              </Button>
            </div>
          )}
        </section>

        <section className="flex flex-col items-center">
          <p className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white">
            {title}
          </p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
            {skills.join(", ")}
          </p>
        </section>

        <section className="text-gray-700 dark:text-gray-300 space-y-3">
          <div className="flex justify-between px-3">
            <p className="font-semibold">Location: {location}</p>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(createdAt))} ago
            </p>
          </div>

          <p className="text-sm px-3 font-semibold">
            Salary:{" "}
            <span className="font-medium text-indigo-600 dark:text-teal-400">
              {minSalary}
            </span>{" "}
            -{" "}
            <span className="font-medium text-indigo-600 dark:text-teal-400">
              {maxSalary}
            </span>
          </p>

          <div className="flex px-3 items-center">
            <p className="text-sm font-semibold text-green-700 dark:text-green-500">
              {type}
            </p>
            <p className="text-sm flex font-semibold text-gray-500 dark:text-gray-400">
              <Dot className="text-green-600" size={25} strokeWidth={3} />
              {status}
            </p>
          </div>

          {isOwner && (
            <Link to={`/applications/${jobId}`} className="mt-2">
              <Button className="flex w-full bg-teal-600 hover:bg-teal-700 text-white transition rounded-md">
                View Applicants
              </Button>
            </Link>
          )}
        </section>

        <section className="text-gray-700 dark:text-gray-300 space-y-3">
          <p className="font-semibold text-lg text-indigo-700 dark:text-teal-500">
            Job Description
          </p>
          <p className="leading-relaxed text-sm">{description}</p>
          <p className="leading-relaxed text-sm mt-2">
            <span className="font-semibold text-base text-indigo-700 dark:text-teal-500">
              Requirements:
            </span>{" "}
            {requirements}
          </p>

          {!LoggedInCompany && (
            <>
              <Button
                onClick={handleApply}
                className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-gray-800 dark:text-gray-900 transition rounded-md"
              >
                {uploadResumeMutation.isLoading ? (
                  <LoaderPinwheel className="animate-spin text-yellow-100" />
                ) : (
                  "Apply Now"
                )}
              </Button>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              />
            </>
          )}
        </section>

        <section className="border-t border-gray-200 dark:border-gray-700 pt-4 text-gray-700 dark:text-gray-300">
          <p className="font-semibold text-lg text-indigo-700 dark:text-teal-500">
            About {companyName}
          </p>
          <p className="text-sm leading-relaxed">{bio}</p>
          <div className="mt-2 text-sm">
            <p>
              Company Size:{" "}
              <span className="font-medium text-indigo-600 dark:text-teal-400">
                {companySize}
              </span>
            </p>
            <p>
              Website:{" "}
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-teal-300"
              >
                {website}
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default JobCard;
