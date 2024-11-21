import { Link } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  BriefcaseBusiness,
} from "lucide-react";

import { useSelector } from "react-redux";

const FooterBar = () => {
  const company = useSelector((state) => state.company.company);
  const user = useSelector((state) => state.user.user);

  return (
    <nav className="fixed bottom-0 w-full bg-black text-white py-3 lg:hidden">
      <div
        className={`flex  ${
          company ? "justify-evenly" : "justify-around"
        }  items-center`}
      >
        <Link to="/" className="flex flex-col items-center hover:text-blue-400">
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        {user && (
          <>
            {" "}
            <Link
              to="/network"
              className="flex flex-col items-center hover:text-blue-400"
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Network</span>
            </Link>
            <Link
              to="/jobs"
              className="flex flex-col items-center hover:text-blue-400"
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-xs font-medium">Jobs</span>
            </Link>
            <Link
              to="/messaging"
              className="flex flex-col items-center hover:text-blue-400"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-xs font-medium">Messages</span>
            </Link>
          </>
        )}

        {company && (
          <>
            <Link
              to="/companyjobs"
              className=" flex flex-col items-center hover:text-blue-600"
            >
              <BriefcaseBusiness className="inline-block w-5 h-5 mr-1" />
              Jobs
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default FooterBar;
