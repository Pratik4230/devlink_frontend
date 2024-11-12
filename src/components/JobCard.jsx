import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const JobCard = ({ job }) => {
  console.log("1 job", job);

  //   companyName, companySize, locations, website,
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

  const { companyName, bio, companySize, website } = company;

  return (
    <main className="container mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-3xl">
      <div className="space-y-6">
        {/* Company Information */}
        <section className="flex items-center space-x-4">
          <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
            <AvatarImage src={logo} />
            <AvatarFallback>{companyName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {companyName}
            </p>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              {title}
            </p>
          </div>
        </section>

        {/* Job Title and Skills */}
        <section>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">
            {title}
          </p>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            {skills}
          </p>
        </section>

        {/* Location, Salary, and Job Type */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between text-gray-700 dark:text-gray-300">
          <p className="text-sm">
            {location}{" "}
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {createdAt}
            </span>
          </p>
          <p className="text-sm font-semibold">
            Salary: <span className="font-medium">{minSalary}</span> -{" "}
            <span className="font-medium">{maxSalary}</span>
          </p>
          <p className="text-sm">
            {type}{" "}
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {status}
            </span>
          </p>
        </section>

        {/* Job Description */}
        <section className="text-gray-700 dark:text-gray-300 space-y-2">
          <p className="font-semibold text-lg">Job Description</p>
          <p className="leading-relaxed text-sm">{description}</p>
          <p className="leading-relaxed text-sm mt-2">{requirements}</p>
        </section>

        {/* Company Details */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-4 text-gray-700 dark:text-gray-300">
          <p className="font-semibold text-lg">About {companyName}</p>
          <p className="text-sm leading-relaxed">{bio}</p>
          <div className="mt-2 text-sm">
            <p>Company Size: {companySize}</p>
            <p>
              Website:{" "}
              <a
                href={website}
                className="text-indigo-600 dark:text-indigo-400 underline"
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
