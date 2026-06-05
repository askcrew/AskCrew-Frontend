"use client";

import FormGroup from "@/components/global/form-group";
import { FileUploader } from "@/components/global/file-uplaod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconSparkles, IconPlus, IconX, IconUpload } from "@tabler/icons-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { ISeason, SeasonFormValues, seasonSchema } from "./schema";
import { MovieFileUpload } from "../../movies/movie-file-upload";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface SeasonFormProps {
  season?: ISeason;
  onCancel: () => void;
}

export function SeasonForm({ season, onCancel }: SeasonFormProps) {
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [trailerVideo, setTrailerVideo] = React.useState<File | null>(null);
  const [trailerProgress, setTrailerProgress] = React.useState(0);
  const [trailerId, setTrailerId] = React.useState<string>("");
  const params = useParams();
  const seriesId = params.id as string;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      season_number: season?.season_number?.toString() || "",
      series_id: season?.series?.id.toString() || seriesId || "",
      price: season?.price?.toString() || "",
      actors: season?.actors?.length
        ? season.actors.map((a) => ({
            name: a.name,
            image: a.image || "",
          }))
        : [{ name: "", image: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "actors",
  });

  const handleCoverImage = (file: File[] | null) => {
    setCoverImage(file ? file[0] : null);
  };

  useEffect(() => {
    if (trailerProgress === 100) {
      clearErrors("trailer");
    }

    if (trailerId) {
      setValue("trailer", trailerId);
    }
  }, [trailerProgress, trailerId, clearErrors, setValue, watch]);

  const onSubmit = async (data: SeasonFormValues) => {
  try {
    const formData = new FormData();
    formData.append("season_number", data.season_number);
    formData.append("series_id", data.series_id);
    formData.append("price", data.price);
    formData.append("actors", JSON.stringify(data.actors));
    if (coverImage) formData.append("cover_photo", coverImage);
    if (trailerVideo) formData.append("trailer", data.trailer);

    let response;
    if (season && season.id) {
      // Edit mode: PATCH to /content/seasons/{id}/
      response = await axiosInstance.patch(
        `/content/seasons/${season.id}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      // Add mode: POST to /content/seasons/
      response = await axiosInstance.post(
        "/content/seasons/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    }

    onCancel();
    Swal.fire({
      icon: "success",
      title: season ? "Season Updated" : "Season Added",
      text: `The season has been ${season ? "updated" : "added"} successfully.`,
    });
    window.location.reload();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: "An error occurred while submitting the form.",
    });
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Cover Photo */}
        <FileUploader
          label="Season Cover Photo"
          maxFiles={1}
          onChange={handleCoverImage}
        />

        {/* Trailer Video */}
        <div className="space-y-2">
          <MovieFileUpload
            label="Movie File"
            onFileSelect={setTrailerVideo}
            value={trailerVideo}
            progress={trailerProgress}
            onProgressUpdate={setTrailerProgress}
            onUploadComplete={setTrailerId}
            accept={{ "video/*": [".mp4", ".mov", ".mkv"] }}
            errorMessage={errors.trailer?.message}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Upload a short trailer video for this season
        </p>
      </div>

      {/* Season Number and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup
          label="Season Number"
          type="number"
          placeholder="1"
          {...register("season_number")}
          className="h-11 border-2 focus-visible:border-orange-500"
          message={errors.season_number?.message}
        />
        <FormGroup
          label="Price ($)"
          type="number"
          step="0.01"
          placeholder="29.99"
          {...register("price")}
          className="h-11 border-2 focus-visible:border-orange-500"
          message={errors.price?.message}
        />
      </div>

      {/* Season Title */}
      <FormGroup
        label="Season Title"
        placeholder="1"
        {...register("series_id")}
        className="h-11 border-2 focus-visible:border-orange-500"
        message={errors.series_id?.message}
      />

      {/* Release Date */}
      {/* <FormGroup
          label="Release Date"
          type="date"
          {...register("release_date")}
          className="h-11 border-2 focus-visible:border-orange-500"
          message={errors.release_date?.message}
        /> */}

      {/* Actors */}
      <div className="space-y-3 p-4 rounded-lg bg-linear-to-br from-orange-500/5 to-purple-500/5 border border-orange-500/20">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-foreground">
            Cast & Actors
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", image: "" })}
            className="h-8 border-2 border-orange-500/30 hover:bg-orange-500/10"
          >
            <IconPlus className="mr-1 size-3" />
            Add Actor
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-2 p-3 rounded-lg bg-background border border-border"
            >
              <div className="flex items-center gap-2 flex-1">
                <Avatar className="size-10 border-2 border-orange-500/20">
                  <AvatarImage src={field.image} alt={field.name} />
                  <AvatarFallback className="bg-orange-500/10 text-orange-600 text-xs">
                    {field.name
                      ? field.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Actor Name"
                    {...register(`actors.${index}.name`)}
                    className="h-9 border-2 focus-visible:border-orange-500"
                  />
                  <div className="flex gap-2">
                    <Controller
                      control={control}
                      name={`actors.${index}.image`}
                      render={({ field: imgField }) => (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              imgField.onChange(url);
                            }
                          }}
                          className="h-9 border-2 focus-visible:border-orange-500 text-xs"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-9 w-9 text-destructive hover:bg-destructive/10"
                >
                  <IconX className="size-4" />
                </Button>
              )}
            </div>
          ))}
          {errors.actors && (
            <p className="text-xs text-red-500">
              {(errors.actors as any)?.message}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11 border-2 hover:bg-muted transition-all"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-11 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
        >
          <IconSparkles className="mr-2 size-4" />
          {season ? "Update Season" : "Add Season"}
        </Button>
      </div>
    </form>
  );
}
