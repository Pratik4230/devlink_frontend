import React from "react";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import JobCard from "../components/JobCard";

const Jobs = () => {
  const { toast } = useToast();

  const {
    data: jobs,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/job/feed");
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        description: data.message || "jobs fetched successfully",
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

  if (jobsLoading) {
    return <p>loading jobs</p>;
  }

  if (jobsError) {
    return <p>Eoooe</p>;
  }

  // console.log("jobs", jobs);

  return (
    <main className="mt-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div>
        {jobs?.data?.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg font-medium">
            No jobs available at the moment.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 ">
            {jobs?.data?.map((job) => (
              <JobCard key={job?._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Jobs;
