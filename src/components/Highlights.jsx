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
    refetchInterval: 50000,
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
    <div className="w-full bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-lg shadow-lg p-6 max-w-2xl mb-5 relative">
      <Button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="absolute right-4 top-4 opacity-80 hover:opacity-100 text-white bg-purple-500 hover:bg-purple-700 transition-all duration-300 rounded-full"
      >
        {showCreateForm ? "Cancel" : <CirclePlus size={32} />}
      </Button>

      {showCreateForm ? (
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            Create a New Highlight
          </h2>
          <input
            type="text"
            placeholder="Enter content"
            value={newHighlight.content}
            onChange={(e) =>
              setNewHighlight({ ...newHighlight, content: e.target.value })
            }
            className="mt-2 p-3 w-full border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewHighlight({ ...newHighlight, image: e.target.files[0] })
            }
            className="mt-2 p-3 w-full bg-purple-100 rounded-lg border-2 border-dashed border-purple-400"
          />
          <div className="mt-4 flex space-x-4">
            <Button
              onClick={handleCreateHighlight}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
              disabled={createHighlightMutation.isLoading}
            >
              {createHighlightMutation.isLoading ? (
                <LoaderPinwheel className="animate-spin text-white" />
              ) : (
                "Create"
              )}
            </Button>
            <Button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {!Highlights?.data || Highlights?.data?.length === 0 ? (
            <p className="text-gray-600 text-center mt-4">
              No highlights yet. Create your first highlight now!
            </p>
          ) : (
            <div className="flex px-4 py-4 space-x-6 overflow-x-auto scrollbar-hide">
              {Highlights.data.map((highlight) => (
                <Popover key={highlight.highlightId}>
                  <PopoverTrigger asChild>
                    <button className="flex-shrink-0 focus:outline-none">
                      <img
                        src={highlight.image}
                        alt="Highlight"
                        className="w-20 h-20 ring-4 ring-orange-400 transition-transform duration-300 ease-in-out transform hover:ring-purple-500 hover:scale-110 rounded-full object-cover"
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] h-[450px] p-0 bg-gradient-to-t from-gray-800 to-black rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <div className="flex items-center space-x-4 p-4 bg-black bg-opacity-60">
                      <Avatar className="w-14 h-14 rounded-full border-2 border-gray-300 shadow-lg">
                        <AvatarImage src={highlight.avatar} />
                        <AvatarFallback>{highlight.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold">
                          <Link
                            to={`/profile/${highlight.authorId}`}
                            className="hover:text-blue-400 hover:underline"
                          >
                            {highlight.author}
                          </Link>
                        </p>
                        <p className="text-sm text-gray-400">
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
                    <div className="p-4 bg-black bg-opacity-60">
                      <p className="text-white text-sm mb-4">
                        {highlight.content}
                      </p>
                      {userId === highlight?.authorId && (
                        <Button
                          onClick={() =>
                            handleDeleteHighlight(highlight.highlightId)
                          }
                          className="w-full bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-300"
                          disabled={deleteHighlightMutation.isLoading}
                        >
                          {deleteHighlightMutation.isLoading ? (
                            <LoaderPinwheel className="animate-spin text-white" />
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
