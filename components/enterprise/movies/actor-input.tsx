"use client";

import FormGroup from "@/components/global/form-group";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export interface Actor {
  id: string;
  name: string;
  image: File | null;
  imageUrl?: string; // For editing existing actors
}

interface ActorInputProps {
  value?: Actor[];
  onChange?: (actors: Actor[]) => void;
  label?: string;
}

export function ActorInput({
  value = [],
  onChange,
  label = "Cast Members",
}: ActorInputProps) {
  const [actors, setActors] = React.useState<Actor[]>(value);

  React.useEffect(() => {
    setActors(value);
  }, [value]);

  const handleActorsChange = (newActors: Actor[]) => {
    setActors(newActors);
    onChange?.(newActors);
  };

  const addActor = () => {
    const newActor: Actor = {
      id: `actor-${Date.now()}`,
      name: "",
      image: null,
    };
    handleActorsChange([...actors, newActor]);
  };

  const removeActor = (id: string) => {
    handleActorsChange(actors.filter((actor) => actor.id !== id));
  };

  const updateActorImage = (id: string, files: File[]) => {
    const image = files.length > 0 ? files[0] : null;
    handleActorsChange(
      actors.map((actor) => (actor.id === id ? { ...actor, image } : actor))
    );
  };

  const onFileValidate = React.useCallback((file: File): string | null => {
    // Validate file type (only images)
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }

    // Validate file size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
    }

    return null;
  }, []);

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addActor}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Actor
        </Button>
      </div>

      {actors.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-linear-to-br from-orange-500/5 via-transparent to-purple-600/5">
          <p className="text-sm text-muted-foreground">
            No actors added yet. Click &quot;Add Actor&quot; to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="border rounded-lg p-4 bg-card space-y-4 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => removeActor(actor.id)}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 gap-4 pr-10">
                <div className="space-y-2">
                  <FormGroup
                    label="Actor Name"
                    value={actor.name}
                    onChange={(e) =>
                      handleActorsChange(
                        actors.map((a) =>
                          a.id === actor.id ? { ...a, name: e.target.value } : a
                        )
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Actor Image</Label>
                  <FileUpload
                    value={actor.image ? [actor.image] : []}
                    onValueChange={(files) => updateActorImage(actor.id, files)}
                    onFileValidate={onFileValidate}
                    onFileReject={onFileReject}
                    accept="image/*"
                    maxFiles={1}
                    className="w-full"
                  >
                    <FileUploadDropzone className="min-h-[100px]">
                      <div className="flex flex-col items-center gap-1">
                        <div className="p-2 rounded-full bg-linear-to-r from-orange-500 to-purple-600">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Click or drag image
                        </p>
                      </div>
                    </FileUploadDropzone>
                    <FileUploadList>
                      {actor.imageUrl && !actor.image && (
                        <FileUploadItem key={actor.imageUrl}>
                          <FileUploadItemPreview primeUrl={actor.imageUrl} />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                            >
                              <X />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      )}
                      {actor.image && (
                        <FileUploadItem
                          key={actor.image.name}
                          value={actor.image}
                        >
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                            >
                              <X />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      )}
                    </FileUploadList>
                  </FileUpload>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
