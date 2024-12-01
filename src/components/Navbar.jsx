import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  BriefcaseBusiness,
  FileUser,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { removeUser } from "../store/UserSlice";
import { useToast } from "@/hooks/use-toast";
import { removeCompany } from "../store/CompanySlice";

const Navbar = () => {
  const user = useSelector((state) => state?.user?.user);
  const company = useSelector((state) => state?.company?.company);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // console.log("indi", user);
  // console.log("cop", company);

  const userId = user?._id;
  const companyId = company?._id;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const Logout = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post(
        user ? "/user/logout" : "/company/logout",
        {}
      );
    },
    onSuccess: (data) => {
      // console.log(data);

      toast({ title: data.message || "Logout successful" });

      dispatch(removeUser());
      dispatch(removeCompany());
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["authCompany"] });

      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.log("logout error", error);
    },
  });

  const handleLogout = () => {
    Logout.mutate();
  };

  return (
    <nav
      className={`bg-white shadow-md fixed top-0 w-full z-50 flex justify-center transition-transform ease-in-out duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          DevLink
        </Link>

        <div className="hidden lg:flex space-x-8">
          <Link
            to="/"
            className="text-gray-800 hover:text-indigo-600 transition-colors"
          >
            <Home className="inline-block w-5 h-5 mr-2" />
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/network"
                className="text-gray-800 hover:text-indigo-600 transition-colors"
              >
                <Users className="inline-block w-5 h-5 mr-2" />
                My Network
              </Link>
              <Link
                to="/jobs"
                className="text-gray-800 hover:text-indigo-600 transition-colors"
              >
                <Briefcase className="inline-block w-5 h-5 mr-2" />
                Jobs
              </Link>
              <Link
                to="/messaging"
                className="text-gray-800 hover:text-indigo-600 transition-colors"
              >
                <MessageSquare className="inline-block w-5 h-5 mr-2" />
                Messaging
              </Link>
            </>
          )}

          {company && (
            <>
              <Link
                to="/companyjobs"
                className="text-gray-800 hover:text-indigo-600 transition-colors"
              >
                <BriefcaseBusiness className="inline-block w-5 h-5 mr-2" />
                Jobs
              </Link>
            </>
          )}
        </div>

        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src={user ? user?.avatar : company?.logo} />
              <AvatarFallback>
                {user ? user?.fullname[0] : company?.companyName[0]}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent>
            <Link
              to={user ? `/profile/${userId}` : `/company/${companyId}`}
              className="block py-2 px-4 text-sm text-gray-800 hover:bg-gray-100"
            >
              {user ? "Profile" : "Company Profile"}
            </Link>

            <p
              className="block py-2 px-4 text-sm text-gray-800 hover:bg-gray-100"
              onClick={() => handleLogout()}
            >
              Logout
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
