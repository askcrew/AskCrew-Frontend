"use client";

import { Upload, X, FileVideo } from "lucide-react";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadVideo } from "@/lib/video";
import FormMessage from "@/components/global/form-message";

interface MovieFileUploadProps {
  onFileSelect: (file: File | null) => void;
  progress?: number;
  label?: string;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  value?: File | null;
  onUploadComplete?: (url: string) => void;
  onProgressUpdate?: (progress: number) => void;
  errorMessage?: string; // Add errorMessage prop

}

export function MovieFileUpload({
  onFileSelect,
  label = "Upload Movie",
  accept = {
    "video/*": [".mp4", ".mov", ".avi", ".mkv"],
  },
  maxSize = 1024 * 1024 * 1024 * 5, // 5GB default
  value,
  onUploadComplete,
  onProgressUpdate,
  errorMessage,
}: MovieFileUploadProps) {
  const [file, setFile] = React.useState<File | null>(value || null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    setFile(value || null);
  }, [value]);

  const handleUpload = React.useCallback(
    async (selectedFile: File) => {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const result = await uploadVideo({
          file: selectedFile,
          onProgress: (progress) => {
            if (progress < 100) {
            setUploadProgress(progress);
            if (onProgressUpdate) {
              onProgressUpdate(progress);
            }
          }
          },
          title: selectedFile.name,
        });
        console.log("result:", result);

      if (result) {
        // Set progress to 100% only when the result exists
        setUploadProgress(100);
        if (onProgressUpdate) {
          onProgressUpdate(100);
        }

        if (onUploadComplete) {
          // Return video ID or URL based on what the result contains
          onUploadComplete(result.videoId as string);
        }
      }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload video");
        setFile(null);
        onFileSelect(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete, onProgressUpdate, onFileSelect]
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        onFileSelect(selectedFile);
        handleUpload(selectedFile);
      }
    },
    [onFileSelect, handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize,
    onDropRejected: (fileRejections: FileRejection[]) => {
      const error = fileRejections[0]?.errors[0];
      if (error) {
        toast.error(error.message);
      }
    },
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 text-center bg-linear-to-br from-orange-500/5 via-transparent to-purple-600/5",
            isDragActive
              ? "border-purple-500 bg-purple-500/10"
              :errorMessage ? "border-red-500" : "border-muted-foreground/25 hover:border-purple-500/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="p-3 rounded-full bg-linear-to-r from-orange-500 to-purple-600">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: MP4, MOV, AVI (Max{" "}
              {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg p-4 bg-card">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-md bg-purple-500/10">
              <FileVideo className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate pr-4">{file.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mr-2"
                  onClick={removeFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {(uploadProgress > 0 || isUploading) && uploadProgress < 100 && (
                <div className="space-y-1 pt-2">
                  <Progress
                    value={uploadProgress}
                    className="h-2 *:bg-linear-to-r *:from-orange-500 *:to-purple-600"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
              {uploadProgress === 100 && (
                <p className="text-xs text-purple-600 font-medium pt-1">
                  Upload Complete
                </p>
              )}
            </div>
          </div>
        </div>
      )}
        <FormMessage message={errorMessage} />
    </div>
  );
}
