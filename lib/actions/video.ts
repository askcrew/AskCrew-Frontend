import crypto from "crypto";
import axiosInstance from "../axiosInstance";

interface VideoUploadAuth {
  signature: string;
  expirationTime: number;
  videoId: string;
  libraryId: string;
}

interface CreateVideoParams {
  title: string;
  collectionId?: string;
}

export async function generateVideoUploadAuth(
  params: CreateVideoParams
): Promise<VideoUploadAuth> {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
  const apiKey = process.env.NEXT_PUBLIC_BUNNY_API_KEY;

  if (!libraryId || !apiKey) {
    throw new Error("Bunny.net credentials not configured");
  }

  // Step 1: Create video object in Bunny.net to get a valid video ID
  let response;
  try {
    response = await axiosInstance.post("content/initialize-video/", {
      title: params.title,
    });
  } catch (error) {
    console.error("Error initializing video:", error);
    throw new Error("Failed to initialize video upload. Please try again.");
  }

  const videoId = response.data.video_id;

  // Step 2: Generate presigned signature for TUS upload
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const data = `${libraryId}${apiKey}${expirationTime}${videoId}`;
  const signature = crypto.createHash("sha256").update(data).digest("hex");

  return {
    signature,
    expirationTime,
    videoId,
    libraryId,
  };
}
