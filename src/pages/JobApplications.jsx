import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import ApplicationCard from "../components/ApplicationCard";

const JobApplications = () => {
  const { jobId } = useParams();
  // console.log(jobId);

  const {
    data: applications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["applications", jobId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/jobapplication/applications/${jobId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      // console.log("data", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  if (isLoading) {
    return <p>loading</p>;
  }

  // console.log("applications", applications);

  return (
    <div className="mt-5 flex flex-col items-center gap-5 p-2 md:p-6 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto transition-transform transform hover:scale-105">
      <p className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2 w-full text-center">
        Job Applications
      </p>

      {!applications?.data || applications?.data?.length === 0 ? (
        <div className="flex items-center justify-center w-full p-6 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition-transform transform hover:scale-102">
          No Applications Yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 w-full">
          {applications.data.map((application) => (
            <ApplicationCard key={application?._id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
