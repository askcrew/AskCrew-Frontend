"use client";

import { MovieFileUpload } from "@/components/enterprise/movies/movie-file-upload";
import { ActorInput, Actor } from "@/components/enterprise/movies/actor-input";
import CustomSelect from "@/components/global/custom-select";
import { FileUploader } from "@/components/global/file-uplaod";
import FormGroup from "@/components/global/form-group";
import { Movie } from "@/components/search/use-search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface AddMovieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movie?: Movie | null;
  onSave: (movie: Partial<Movie>) => void;
}

const CATEGORIES = [
  { label: "Action", value: "Action" },
  { label: "Comedy", value: "Comedy" },
  { label: "Drama", value: "Drama" },
  { label: "Sci-Fi", value: "Sci-Fi" },
  { label: "Horror", value: "Horror" },
  { label: "Documentary", value: "Documentary" },
];

export function AddMovieDialog({
  open,
  onOpenChange,
  movie,
  onSave,
}: AddMovieDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [movieFile, setMovieFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [actors, setActors] = useState<Actor[]>([]);

  useEffect(() => {
    if (movie) {
      setTitle(movie.title);
      setDescription(movie.description || "");
      setCategory(movie.category || "");
      setActors([]);
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
      setMovieFile(null);
      setTrailerFile(null);
      setUploadProgress(0);
      setActors([]);
    }
  }, [movie, open]);

  const handleSave = () => {
    // Simulate upload progress if a new file is selected
    console.log("were done for it");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{movie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 py-6">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6">
              <FormGroup
                label="Movie Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter movie title"
              />

              <CustomSelect
                label="Category"
                options={CATEGORIES}
                value={category}
                onValueChange={setCategory}
                placeholder="Select category"
                className="w-full"
              />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter movie description"
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <FileUploader label="Thumbnail" maxFiles={1} />
              <ActorInput value={actors} onChange={setActors} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <MovieFileUpload
              label="Movie File"
              onFileSelect={setMovieFile}
              value={movieFile}
              progress={uploadProgress}
              accept={{ "video/*": [".mp4", ".mov", ".mkv"] }}
            />
            <MovieFileUpload
              label="Trailer File"
              onFileSelect={setTrailerFile}
              value={trailerFile}
              accept={{ "video/*": [".mp4", ".mov", ".mkv"] }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || !category}>
            {movie ? "Save Changes" : "Upload Movie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
