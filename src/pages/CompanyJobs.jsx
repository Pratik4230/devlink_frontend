import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance.js";
import { toast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import CompanyJobList from "../components/CompanyJobList.jsx";
import { useSelector } from "react-redux";
import { LoaderPinwheel } from "lucide-react";

const CompanyJobs = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    skills: "",
    minSalary: "",
    maxSalary: "",
    location: "",
    type: "full-time",
  });

  const [showCreateJobForm, setShowCreateJobForm] = useState(false);
  const queryClient = useQueryClient();
  const company = useSelector((state) => state.company.company);
  const companyId = company?._id;

  const createJobMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/job/create", data);
      return response.data;
    },
    onSuccess: (data) => {
      // console.log("data", data);
      queryClient.invalidateQueries(["companyJobs", companyId]);

      toast({
        description: data.message || "Job created successfully",
      });
      setFormData({
        title: "",
        description: "",
        requirements: "",
        skills: "",
        minSalary: "",
        maxSalary: "",
        location: "",
        type: "full-time",
      });
    },
    onError: (error) => {
      console.log("error", error);

      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "Error creating job",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills.split(",").map((skill) => skill.trim());

    createJobMutation.mutate({ ...formData, skills: skillsArray });
    setShowCreateJobForm(false);
  };

  return (
    <main className="mt-5 ">
      <section className="flex justify-end mb-4">
        <Button onClick={() => setShowCreateJobForm(!showCreateJobForm)}>
          Create Job
        </Button>
      </section>
      {showCreateJobForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full p-2 border rounded"
            required
          />
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="w-full p-2 border rounded"
            required
          />
          <Textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Job Requirements"
            className="w-full p-2 border rounded"
            required
          />
          <Input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills (comma-separated)"
            className="w-full p-2 border rounded"
          />
          <Input
            type="text"
            name="minSalary"
            value={formData.minSalary}
            onChange={handleChange}
            placeholder="Minimum Salary"
            className="w-full p-2 border rounded"
          />
          <Input
            type="text"
            name="maxSalary"
            value={formData.maxSalary}
            onChange={handleChange}
            placeholder="Maximum Salary"
            className="w-full p-2 border rounded"
          />
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-fit mx-3 p-2 border rounded"
          >
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="internship">internship</option>
            <option value="remote">remote</option>
          </select>

          <Button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              createJobMutation.isLoading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={createJobMutation.isLoading}
          >
            {createJobMutation.isLoading ? (
              <LoaderPinwheel className="animate-spin" />
            ) : (
              "Create new Job"
            )}
          </Button>
        </form>
      )}

      <section className="flex  flex-col items-center">
        <h2 className="text-2xl font-semibold">Jobs</h2>
        <CompanyJobList companyId={companyId} />
      </section>
    </main>
  );
};

export default CompanyJobs;
