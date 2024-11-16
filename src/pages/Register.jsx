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

const registerSchema = z.object({
  fullname: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username should be less than 20 characters")
    .trim(),
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

const Register = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/user/register", formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast({ description: data.message || " Successfully registered" });
      queryClient.invalidateQueries(["authUser"]);
      navigate("/");
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message || "something went wrong Try again",
      });
    },
  });

  function onSubmit(values) {
    console.log(values);
    mutation.mutate(values);
    console.log("onsub");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-lg p-10 bg-white shadow-xl rounded-2xl transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Join us and explore endless possibilities!
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700 font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter you full name"
                      {...field}
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Your full legal name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    We'll never share your email with anyone else.
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
                  <FormLabel className="text-purple-700 font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    Choose a strong password to keep your account safe.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              {mutation.isLoading ? (
                <LoaderPinwheel className="animate-spin " />
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-700 hover:text-purple-800 font-semibold underline"
              >
                Log in
              </Link>
            </p>

            <Link to={"/registercompany"}>Register as Company</Link>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
