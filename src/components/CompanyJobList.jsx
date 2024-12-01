import React from "react";
import { useQuery } from "react-query";
import { toast } from "../hooks/use-toast";
import { axiosInstance } from "../utils/axiosInstance";
import JobCard from "./JobCard";

const CompanyJobList = ({ companyId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["companyJobs", companyId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/job/company/${companyId}`);
      return response.data;
    },
    onSuccess: (data) => {
      // console.log("data", data);
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "something went wrong",
      });
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // console.log("data", data);

  return (
    <main className="mt-10 px-1 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div>
        {!data?.data || data?.data?.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg font-medium">
            No jobs available at the moment.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 ">
            {data?.data?.map((job) => (
              <JobCard key={job?._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CompanyJobList;
