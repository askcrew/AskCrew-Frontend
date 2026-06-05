"use client";

import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import { FileUploader } from "@/components/global/file-uplaod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconSparkles, IconUpload } from "@tabler/icons-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { Episode, episodeSchema, IEpisode } from "./schema";
import { MovieFileUpload } from "../../movies/movie-file-upload";
import { useParams } from "next/navigation";

interface EpisodeFormProps {
  episode?: IEpisode;
  onCancel: () => void;
}

export function EpisodeForm({ episode, onCancel }: EpisodeFormProps) {
  const params = useParams();
  const seasonId = params?.seasonId;
  const [video, setVideo] = React.useState<File | null>(null);
  const [videoProgress, setVideoProgress] = React.useState(0);
  const [videoId, setVideoId] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    clearErrors,
    setValue,
    watch,
  } = useForm<Episode>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      episode_number: episode?.episode_number?.toString() || "",
      title: episode?.title || "",
      description: episode?.description || "",
      season_id: seasonId
        ? Array.isArray(seasonId)
          ? seasonId[0]
          : seasonId.toString()
        : "",
      video: episode?.video || "",
    },
  });
  console.log("seasonId", seasonId);

  React.useEffect(() => {
    if (videoProgress === 100) {
      clearErrors("video");
    }
    if (videoId) {
      setValue("video", videoId);
    }
  }, [videoProgress, videoId, clearErrors, setValue, watch]);

  const onSubmit = async (data: Episode) => {
    try {
      const formData = new FormData();
      formData.append("episode_number", data.episode_number);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("video", data.video);
      formData.append("season_id", data.season_id.toString());

      if (episode && episode.id) {
        // Update existing episode
        await axiosInstance.put(`/content/episodes/${episode.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Episode Updated",
          text: `The episode has been updated successfully.`,
        });
      } else {
        // Create new episode
        await axiosInstance.post("/content/episodes/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Episode Added",
          text: `The episode has been added successfully.`,
        });
      }
      onCancel();
      reset();
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while submitting the form.",
      });
    }
  };
  console.log("watch", watch());
  console.log("err", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Thumbnail */}
        {/* <FileUploader label="Episode Thumbnail" maxFiles={1} onChange={(files) => setThumbnail(files ? files[0] : null)} /> */}

        {/* Video File */}
        <div className="space-y-2 w-full">
          <MovieFileUpload
            label=" Episode Video File"
            onFileSelect={setVideo}
            value={video}
            progress={videoProgress}
            onProgressUpdate={setVideoProgress}
            onUploadComplete={setVideoId}
            accept={{ "video/*": [".mp4", ".mov", ".mkv"] }}
            errorMessage={errors.video?.message}
          />

          <p className="text-xs text-muted-foreground">
            Upload the full episode video file
          </p>
        </div>

        {/* Episode Number and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormGroup
            label="Season ID"
            type="number"
            placeholder="42"
            {...register("season_id")}
            className="h-11 border-2 focus-visible:border-orange-500"
            message={errors.season_id?.message}
          />
          <FormGroup
            label="Episode Number"
            type="number"
            placeholder="1"
            {...register("episode_number")}
            className="h-11 border-2 focus-visible:border-orange-500"
            message={errors?.episode_number?.message}
          />
        </div>

        {/* Episode Title */}
        <FormGroup
          label="Episode Title"
          placeholder="e.g., Introduction to Cinematography"
          {...register("title")}
          className="h-11 border-2 focus-visible:border-orange-500"
          message={errors.title?.message}
        />

        {/* Description */}
        <FormText
          label="Description"
          placeholder="Describe what viewers will learn in this episode..."
          {...register("description")}
          className="min-h-[120px] resize-none border-2 focus-visible:border-orange-500"
          message={errors.description?.message}
        />

        {/* Release Date */}
        {/* <FormGroup
          label="Release Date"
          type="date"
          {...register("releaseDate")}
          className="h-11 border-2 focus-visible:border-orange-500"
          message={errors.releaseDate?.message}
        /> */}
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
          {episode ? "Update Episode" : "Add Episode"}
        </Button>
      </div>
    </form>
  );
}
