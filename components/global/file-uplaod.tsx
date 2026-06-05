"use client";

import { Upload, X, Video } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Label } from "../ui/label";

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".avi",
    ".mkv",
    ".flv",
    ".wmv",
  ];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.includes(ext));
};

export function FileUploader({
  primaryPreviewFile,
  label,
  maxFiles = 1,
  value,
  onChange,
}: {
  primaryPreviewFile?: string;
  label?: string;
  maxFiles?: number;
  value?: File[] | null;
  onChange?: (files: File[] | null) => void;
}) {
  const [files, setFiles] = React.useState<File[]>(value || []);
  const isVideo = primaryPreviewFile ? isVideoUrl(primaryPreviewFile) : false;

  const onFileValidate = (file: File): string | null => {
    // Validate max files
    if (files.length >= maxFiles) {
      return `You can only upload up to ${maxFiles} files`;
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
    }

    return null;
  };

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  React.useEffect(() => {
    if (onChange) {
      onChange(files);
    }
  }, [files, onChange]);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* Primary Preview File - shown outside FileUploadList */}
      {primaryPreviewFile && (
        <div className="flex items-center gap-3 rounded-lg border p-3 bg-background">
          {isVideo ? (
            <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-md border shrink-0">
              <Video className="size-8 text-muted-foreground" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-md border overflow-hidden shrink-0">
              <Image
                src={primaryPreviewFile}
                alt="Preview"
                className="w-full h-full object-cover"
                width={64}
                height={64}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {isVideo ? "Video file" : "File"}
            </p>
            <p className="text-xs text-muted-foreground">Already uploaded</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => {
              // Handle delete if needed
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      <FileUpload
        value={files}
        onValueChange={setFiles}
        onFileValidate={onFileValidate}
        onFileReject={onFileReject}
        accept="image/*,application/pdf"
        maxFiles={maxFiles}
        className="w-full"
        multiple
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drag & drop files here</p>
            <p className="text-muted-foreground text-xs">
              Or click to browse (max {maxFiles} files)
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 w-fit">
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem key={file.name} value={file}>
              {/* Show preview for images, icon for pdf, icon for others */}
              {file.type.startsWith("image/") ? (
                <FileUploadItemPreview />
              ) : file.type === "application/pdf" ? (
                <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-md border mr-2">
                  <span className="text-red-500 font-bold text-lg">PDF</span>
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-md border mr-2">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
              )}
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    </div>
  );
}
