import * as tus from "tus-js-client";
import { generateVideoUploadAuth } from "@/lib/actions/video";

interface UploadOptions {
  file: File;
  onProgress: (p: number) => void;
  title?: string;
  collectionId?: string;
}

export async function uploadVideo({
  file,
  onProgress,
  title,
  collectionId,
}: UploadOptions): Promise<{ videoId: string; url: string | null }> {
  return new Promise(async (resolve, reject) => {
    try {
      // Get upload authentication from server (creates video object first)
      const auth = await generateVideoUploadAuth({
        title: title || file.name,
        collectionId,
      });

      const upload = new tus.Upload(file, {
        endpoint: "https://video.bunnycdn.com/tusupload",
        retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
        headers: {
          AuthorizationSignature: auth.signature,
          AuthorizationExpire: auth.expirationTime.toString(),
          VideoId: auth.videoId,
          LibraryId: auth.libraryId,
        },
        metadata: {
          filetype: file.type,
          title: title || file.name,
          ...(collectionId && { collection: collectionId }),
        },
        onError(error) {
          console.error("Upload failed:", error);
          reject(error);
        },
        onProgress(bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          onProgress(Number(percentage));
        },
        onSuccess() {
          console.log("Upload finished:", auth.videoId);
          resolve({ videoId: auth.videoId, url: auth.videoId });
        },
      });

      // Check if there are any previous uploads to continue
      upload
        .findPreviousUploads()
        .then((previousUploads) => {
          // Found previous uploads so we select the first one
          if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }

          // Start the upload
          upload.start();
        })
        .catch((error) => {
          console.error("Error finding previous uploads:", error);
          // Start upload anyway
          upload.start();
        });
    } catch (error) {
      console.error("Error generating upload auth:", error);
      reject(error);
    }
  });
}
