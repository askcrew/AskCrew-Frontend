"use client";
import { Actor, ActorInput } from "@/components/enterprise/movies/actor-input";
import { MovieFileUpload } from "@/components/enterprise/movies/movie-file-upload";
import CustomSelect from "@/components/global/custom-select";
import { FileUploader } from "@/components/global/file-uplaod";
import FormGroup from "@/components/global/form-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axiosInstance";
import { IMovie, MovieFormData, movieSchema } from "@/Schemas/enterprise/movie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const MovieForm = ({ movie }: { movie?: IMovie }) => {
  const [movieFile, setMovieFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [movieId, setMovieId] = useState<string>("");
  const [trailerId, setTrailerId] = useState<string>("");
  const [movieProgress, setMovieProgress] = useState(0);
  const [trailerProgress, setTrailerProgress] = useState(0);
  const [actors, setActors] = useState<Actor[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    clearErrors,
    setValue,
    reset,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    mode: "all",
    defaultValues: {
      name: movie?.name || "",
      about: movie?.about || "",
      trailer: movie?.trailer || "",
      video: movie?.video || "",
      price: movie ? Number(movie.price) : undefined,
      category_id: movie ? String(movie.category.id) : "",
    },
  });

  // Fetch categories using tanstack query
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/categories");
      return res.data.categories;
    },
  });

  // Transform categories for CustomSelect
  const categoryOptions = categoriesData
    ? categoriesData.map((cat: { id: number; name: string }) => ({
        label: cat.name,
        value: cat.id,
      }))
    : [];

  useEffect(() => {
    if (movieProgress === 100) {
      clearErrors("video");
    }

    if (trailerProgress === 100) {
      clearErrors("trailer");
    }
    if (movieId) {
      setValue("video", movieId);
    }
    if (trailerId) {
      setValue("trailer", trailerId);
    }
  }, [
    movieProgress,
    trailerProgress,
    movieId,
    trailerId,
    clearErrors,
    setValue,
    watch,
  ]);

  const handleCoverImage = (file: File[] | null) => {
    setCoverImage(file ? file[0] : null);
  };

  const onSubmit = async (data: MovieFormData) => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Append all text fields
      formDataToSend.append("name", data.name);
      formDataToSend.append("price", data.price.toString());
      formDataToSend.append("category_id", data.category_id);
      formDataToSend.append("about", data.about || "");
      formDataToSend.append("trailer", data.trailer);
      formDataToSend.append("video", data.video);
      if (coverImage) {
        formDataToSend.append("cover_image", coverImage);
      }
      if (actors && actors.length > 0) {
        const actorsData = actors.map((actor) => ({
          name: actor.name,
          image: actor.image ? actor.image : null,
        }));
        formDataToSend.append("actors_data", JSON.stringify(actorsData));
      }

      let response;
      if (movie && movie.id) {
        // Update existing movie
        response = await axiosInstance.put(
          `content/movies/${movie.id}/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Movie Updated",
            text: "The movie has been updated successfully.",
          });
        }
      } else {
        // Create new movie
        response = await axiosInstance.post("content/movies/", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Movie Added",
            text: "The movie has been added successfully.",
          });
        }
      }
      reset();
      setActors([]);
      setCoverImage(null);
      router.push("/enterprise/dashboard/movies");
    } catch (e: unknown) {
      const error = e as AxiosError<{ message: string }>;
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred while submitting the form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid  gap-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FormGroup
            label="Movie Title"
            {...register("name")}
            placeholder="Enter movie title"
            size={"xl"}
            message={errors.name?.message as string}
          />
          <FormGroup
            label="Movie Price"
            {...register("price", { valueAsNumber: true })}
            placeholder="Enter movie title"
            size={"xl"}
            message={errors.price?.message as string}
          />

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Category"
                options={categoryOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder={
                  isCategoriesLoading ? "Loading..." : "Select category"
                }
                size={"xl"}
                className="w-full"
                message={
                  categoriesError
                    ? "Failed to load categories"
                    : (errors.category_id?.message as string)
                }
              />
            )}
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <Textarea
              id="description"
              {...register("about")}
              placeholder="Enter movie description"
              className="min-h-30 resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <FileUploader
            label="Thumbnail"
            maxFiles={1}
            onChange={handleCoverImage}
          />
          <ActorInput value={actors} onChange={setActors} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MovieFileUpload
          label="Movie File"
          onFileSelect={setMovieFile}
          value={movieFile}
          progress={movieProgress}
          onProgressUpdate={setMovieProgress}
          onUploadComplete={setMovieId}
          accept={{ "video/*": [".mp4", ".mov", ".mkv"] }}
          errorMessage={errors.video?.message}
        />
        <MovieFileUpload
          label="Trailer File"
          onFileSelect={setTrailerFile}
          value={trailerFile}
          progress={trailerProgress}
          onProgressUpdate={setTrailerProgress}
          onUploadComplete={setTrailerId}
          accept={{ "video/*": [".mp4", ".mov", ".mkv"] }}
          errorMessage={errors.trailer?.message}
        />
      </div>
      <Button
        type="submit"
        variant={"linear-1"}
        size={"xl"}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default MovieForm;
