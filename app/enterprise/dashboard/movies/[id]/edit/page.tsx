"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import MovieForm from "@/components/enterprise/movies/movie-form";

const EditMoviePage = () => {
  const params = useParams();
  const id = params?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/content/movies/${id}`);
      return res.data;
    },
    enabled: !!id, // only run if id exists
  });

  console.log("getedit",data);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Movie</h1>
          <p className="text-muted-foreground">
            Edit a movie in your collection
          </p>
        </div>
      </div>
      {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <svg
              className="animate-spin h-6 w-6 text-muted-foreground mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading movie...
          </div>
        ) : error ? (
        <div className="text-red-500">Failed to load movie.</div>
      ) : (
        <MovieForm movie={data}/>
      )}
    </div>
  );
};

export default EditMoviePage;