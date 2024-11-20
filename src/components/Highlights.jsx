import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axiosInstance";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CirclePlus, LoaderPinwheel } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Highlights = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHighlight, setNewHighlight] = useState({
    content: "",
    image: null,
  });

  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  const {
    data: Highlights,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["highlights"],
    queryFn: async () => {
      const response = await axiosInstance.get("/highlight/get");
      return response.data;
    },
    onError: (error) => {
      console.error("Error fetching highlights:", error);
    },
  });

  const deleteHighlightMutation = useMutation({
    mutationFn: async (highlightId) => {
      await axiosInstance.delete(`/highlight/delete/${highlightId}`);
    },
    onSuccess: () => {
      // alert("Highlight deleted successfully!");
      queryClient.invalidateQueries(["highlights"]);
    },
    onError: (error) => {
      console.error("Error deleting highlight:", error);
      alert("Failed to delete highlight. Please try again.");
    },
  });

  const createHighlightMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/highlight/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      // alert("Highlight created successfully!");
      queryClient.invalidateQueries(["highlights"]);
      setShowCreateForm(false);
    },
    onError: (error) => {
      console.error("Error creating highlight:", error);
      alert("Failed to create highlight. Please try again.");
    },
  });

  const handleCreateHighlight = () => {
    if (!newHighlight.image || !newHighlight.content) {
      alert("Please provide both content and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("content", newHighlight.content);
    formData.append("image", newHighlight.image);

    createHighlightMutation.mutate(formData);
  };

  const handleDeleteHighlight = (highlightId) => {
    deleteHighlightMutation.mutate(highlightId);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className=" w-full bg-white rounded-lg shadow-lg p-4  max-w-2xl mb-5  relative ">
      <Button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className=" absolute right-1  opacity-80 hover:opacity-100  text-white"
      >
        {showCreateForm ? "Cancel" : <CirclePlus size={32} />}
      </Button>

      {showCreateForm ? (
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create a New Highlight</h2>
          <input
            type="text"
            placeholder="Enter content"
            value={newHighlight.content}
            onChange={(e) =>
              setNewHighlight({ ...newHighlight, content: e.target.value })
            }
            className="mt-2 p-2 w-full border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewHighlight({ ...newHighlight, image: e.target.files[0] })
            }
            className="mt-2 p-2 w-full"
          />
          <div className="mt-4 flex space-x-2">
            <Button
              onClick={handleCreateHighlight}
              className="bg-blue-500 text-white"
              disabled={createHighlightMutation.isLoading}
            >
              {createHighlightMutation.isLoading ? (
                <LoaderPinwheel className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
            <Button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {!Highlights?.data || Highlights?.data?.length === 0 ? (
            <p className="text-gray-500 text-center">
              No highlights yet. Create your first highlight now!
            </p>
          ) : (
            <div className="flex  px-2 py-2   max-w-2xl space-x-4 overflow-x-auto scrollbar-hide ">
              {Highlights.data.map((highlight) => (
                <Popover key={highlight.highlightId}>
                  <PopoverTrigger asChild>
                    <button className="flex-shrink-0 focus:outline-none">
                      <img
                        src={highlight.image}
                        alt="Highlight"
                        className="w-16 h-16 ring-4 ring-orange-400 transition duration-300 ease-in-out transform  hover:ring-purple-300 hover:scale-105   rounded-full  object-cover"
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] h-[450px] p-0 bg-black rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <div className="flex items-center space-x-2 p-4 bg-black bg-opacity-50">
                      <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-indigo-500 shadow-md">
                        <AvatarImage src={highlight.avatar} />
                        <AvatarFallback>{highlight.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white  font-semibold">
                          <Link
                            to={`/profile/${highlight.authorId}`}
                            className="hover:text-blue-500 hover:underline "
                          >
                            {" "}
                            {highlight.author}{" "}
                          </Link>
                        </p>
                        <p className="text-xs text-gray-300">
                          {formatDistanceToNow(new Date(highlight.createdAt))}{" "}
                          ago
                        </p>
                      </div>
                    </div>

                    <div className="flex-grow flex items-center justify-center bg-black">
                      <img
                        src={highlight.image}
                        alt="Highlight"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <div className="p-4 bg-black bg-opacity-50">
                      <p className="text-white text-sm mb-4">
                        {highlight.content}
                      </p>

                      {userId === highlight?.authorId && (
                        <Button
                          onClick={() =>
                            handleDeleteHighlight(highlight.highlightId)
                          }
                          className="w-full bg-red-500 text-white"
                          disabled={deleteHighlightMutation.isLoading}
                        >
                          {deleteHighlightMutation.isLoading ? (
                            <LoaderPinwheel className="animate-spin" />
                          ) : (
                            "Delete Highlight"
                          )}
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Highlights;
