import { useQuery } from "react-query";
import "./App.css";
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./pages/feed";
import Container from "./pages/Container";
import Register from "./pages/Register";
import { axiosInstance } from "./utils/axiosInstance";
import Login from "./pages/Login";

import { useDispatch } from "react-redux";
import { addUser } from "./store/UserSlice";
import { useToast } from "@/hooks/use-toast";
import Profile from "./pages/Profile";
import Network from "./pages/Network";
import Jobs from "./pages/Jobs";
import Conversation from "./pages/Conversation";
import Messaging from "./pages/Messaging";
import CompanyRegister from "./pages/CompanyRegister";
import { addCompany } from "./store/CompanySlice";
import CompanyProfile from "./pages/CompanyProfile";
import CompanyJobs from "./pages/CompanyJobs";
import JobApplications from "./pages/JobApplications";
function App() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],

    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/user/auth");
        dispatch(addUser(response?.data?.data));
        return response.data;
      } catch (error) {
        console.log("auth user error", error);

        if (error.response && error.response.status === 401) {
          return null;
        }
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  const { data: authCompany, isLoading: companyLoading } = useQuery({
    queryKey: ["authCompany"],

    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/company/auth");
        dispatch(addCompany(response?.data?.data));
        return response.data;
      } catch (error) {
        console.log("auth company error", error);

        if (error.response && error.response.status === 401) {
          return null;
        }
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });

  if (isLoading || companyLoading) {
    return <p>loading</p>;
  }

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Container />}>
            <Route
              path="/"
              element={
                authUser || authCompany ? <Feed /> : <Navigate to={"/login"} />
              }
            />

            <Route
              path="/register"
              element={authUser ? <Navigate to={"/"} /> : <Register />}
            />

            <Route
              path="/registercompany"
              element={
                authCompany ? <Navigate to={"/"} /> : <CompanyRegister />
              }
            />
            <Route
              path="/login"
              element={
                authUser || authCompany ? <Navigate to={"/"} /> : <Login />
              }
            />

            <Route
              path="/network"
              element={authUser ? <Network /> : <Navigate to={"/login"} />}
            />

            <Route
              path="/profile/:userId"
              element={
                authUser || authCompany ? (
                  <Profile />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />

            <Route
              path="jobs"
              element={authUser ? <Jobs /> : <Navigate to={"/login"} />}
            />

            <Route
              path="/conversation/:receiverId"
              element={authUser ? <Conversation /> : <Navigate to={"/login"} />}
            />

            <Route
              path="/messaging"
              element={authUser ? <Messaging /> : <Navigate to={"/login"} />}
            />

            {/* company related routes  */}

            <Route
              path="/company/:companyId"
              element={
                authUser || authCompany ? (
                  <CompanyProfile />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />

            <Route
              path="/companyjobs"
              element={
                authCompany ? <CompanyJobs /> : <Navigate to={"/login"} />
              }
            />

            <Route
              path="/applications/:jobId"
              element={
                authCompany ? <JobApplications /> : <Navigate to={"/login"} />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
