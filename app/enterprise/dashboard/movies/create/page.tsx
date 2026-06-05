"use client";

import MovieForm from "@/components/enterprise/movies/movie-form";

const CreateMoviePage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Add Movie</h1>
          <p className="text-muted-foreground">
            Add a new movie to your collection
          </p>
        </div>
      </div>
      <MovieForm  />
    </div>
  );
};

export default CreateMoviePage;
