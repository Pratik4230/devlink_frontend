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
    <nav className="fixed bottom-0 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 shadow-lg lg:hidden">
      <div
        className={`flex ${
          company ? "justify-evenly" : "justify-around"
        } items-center`}
      >
        <Link
          to="/"
          className="flex flex-col items-center hover:text-yellow-300 transition-all duration-200"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-semibold">Home</span>
        </Link>
        {user && (
          <>
            <Link
              to="/network"
              className="flex flex-col items-center hover:text-yellow-300 transition-all duration-200"
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-semibold">Network</span>
            </Link>
            <Link
              to="/jobs"
              className="flex flex-col items-center hover:text-yellow-300 transition-all duration-200"
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-xs font-semibold">Jobs</span>
            </Link>
            <Link
              to="/messaging"
              className="flex flex-col items-center hover:text-yellow-300 transition-all duration-200"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-xs font-semibold">Messages</span>
            </Link>
          </>
        )}
        {company && (
          <Link
            to="/companyjobs"
            className="flex flex-col items-center hover:text-yellow-300 transition-all duration-200"
          >
            <BriefcaseBusiness className="w-6 h-6" />
            <span className="text-xs font-semibold">Jobs</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default FooterBar;
