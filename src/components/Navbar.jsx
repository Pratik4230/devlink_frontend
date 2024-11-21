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
      const response = await axiosInstance.post(
        user ? "/user/logout" : "/company/logout"
      );
      return response.data;
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
      console.log(error);
    },
  });

  const handleLogout = () => {
    dispatch(removeUser());
    dispatch(removeCompany());
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
    queryClient.invalidateQueries({ queryKey: ["authCompany"] });
    Logout.mutate();

    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`bg-white border-b border-gray-200 fixed top-0 w-full z-50 flex justify-center transition-transform duration-300 ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      <div className="max-w-5xl w-full flex justify-between items-center py-3 px-6">
        <Link to="/" className="text-lg font-semibold text-blue-600">
          DevLink
        </Link>

        <div className="hidden lg:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            <Home className="inline-block w-5 h-5 mr-1" />
            Home
          </Link>

          {user && (
            <>
              <Link to="/network" className="text-gray-700 hover:text-blue-600">
                <Users className="inline-block w-5 h-5 mr-1" />
                My Network
              </Link>
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600">
                <Briefcase className="inline-block w-5 h-5 mr-1" />
                Jobs
              </Link>
              <Link
                to="/messaging"
                className="text-gray-700 hover:text-blue-600"
              >
                <MessageSquare className="inline-block w-5 h-5 mr-1" />
                Messaging
              </Link>
            </>
          )}

          {company && (
            <>
              <Link
                to="/companyjobs"
                className="text-gray-700 hover:text-blue-600"
              >
                <BriefcaseBusiness className="inline-block w-5 h-5 mr-1" />
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
              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
            >
              {user ? "Profile" : "Company Profile"}
            </Link>

            <p
              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
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
