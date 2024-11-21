import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoaderPinwheel } from "lucide-react";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
      {
        message:
          "Password must contain at least one uppercase,lowercase,number,special character",
      }
    ),
});

const Login = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/user/login", formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast({ description: data.message || "Login Successful" });
      queryClient.invalidateQueries(["authUser"]);
      navigate("/");
    },

    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        description: error.response.data.message || "login user error",
      });
    },
  });

  function onSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-0 lg:p-6">
      <div className="w-full max-w-md p-2 lg:p-8 bg-white shadow-lg rounded-lg py-8 ">
        <h2 className="text-2xl font-bold text-center text-blue-700 mt-2 mb-6">
          Welcome Back
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-3 lg:space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700 font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your email"
                      type="email"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Enter the email associated with your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700 font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your password"
                      type="password"
                      {...field}
                      className="w-full px-2 lg:px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Your account password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <LoaderPinwheel className="animate-spin " />
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-black hover:text-blue-600 font-semibold underline"
              >
                Create an account
              </Link>
            </p>

            <Link
              to="/companylogin"
              className=" flex justify-center text-black-600 hover:text-blue-600  font-semibold underline"
            >
              login as company
            </Link>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
