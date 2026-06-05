"use client";

import { useState } from "react";
import axios from "axios";

export default function VideoUploader() {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });
      alert("Upload complete!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <input type="file" onChange={handleFileChange} accept="video/*" />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>

      {progress > 0 && (
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-blue-600 h-3 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <p>{progress > 0 && `${progress}%`}</p>
    </div>
  );
}
