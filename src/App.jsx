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
        toast({
          variant: "destructive",
          title: error?.message,
        });
        toast({
          variant: "destructive",
          description: error?.response?.data?.message,
        });
        if (error.response && error.response.status === 401) {
          return null;
        }
      }
    },
  });

  if (isLoading) {
    return <p>loading</p>;
  }

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Container />}>
            <Route
              path="/"
              element={authUser ? <Feed /> : <Navigate to={"/login"} />}
            />

            <Route
              path="/register"
              element={authUser ? <Navigate to={"/"} /> : <Register />}
            />
            <Route
              path="/login"
              element={authUser ? <Navigate to={"/"} /> : <Login />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
