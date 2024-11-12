import { Link } from "react-router-dom";
import { Home, Users, Briefcase, MessageSquare, Bell } from "lucide-react";

const FooterBar = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-black text-white py-3 md:hidden">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center hover:text-blue-400">
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </Link>
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
        <Link
          to="/notifications"
          className="flex flex-col items-center hover:text-blue-400"
        >
          <Bell className="w-6 h-6" />
          <span className="text-xs font-medium">Notifications</span>
        </Link>
      </div>
    </nav>
  );
};

export default FooterBar;
