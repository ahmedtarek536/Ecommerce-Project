"use client";

import { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/utils/firebas";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Define the type for media items
interface MediaItem {
  type: "firebase" | "url";
  url: string;
  fileType?: "image" | "video";
}

export default function MediaUploader({
  setImages,
  variantIndex,
}: {
  setImages: (images: { imageUrl: string }[], index: number) => void;
  variantIndex: number;
}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [url, setUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progressBar, setProgressBar] = useState<number>(0);

  // Handle file input and upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      uploadFilesToFirebase(fileArray);
    }
  };

  // Upload files to Firebase Storage
  const uploadFilesToFirebase = async (files: File[]) => {
    const storage = getStorage(app);
    setIsUploading(true);

    for (const file of files) {
      const storageRef = ref(storage, `media/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              let progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
              setProgressBar(Math.round(progress));
            },
            (error) => {
              console.error("Error uploading file:", error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                const fileType = getFileType(file);
                setMedia((prevMedia) => [
                  ...prevMedia,
                  { type: "firebase", url: downloadURL, fileType },
                ]);
                resolve();
              } catch (error) {
                console.error("Error fetching download URL:", error);
                reject(error);
              }
            }
          );
        });
      } catch (error) {
        console.error("Error in the upload process:", error);
      }
    }

    setIsUploading(false);
  };

  // Handle adding media by URL
  const handleAddByUrl = () => {
    if (url) {
      const fileType = getFileTypeFromUrl(url);
      if (fileType === "unknown") {
        alert("Invalid URL type. Please enter a valid image or video URL.");
        return;
      }
      setMedia((prevMedia) => [...prevMedia, { type: "url", url, fileType }]);
      setUrl("");
      setIsModalOpen(false);
    }
  };

  // Determine file type from URL (based on file extension)
  const getFileTypeFromUrl = (url: string) => {
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return "image";
    if (url.match(/\.(mp4|webm|ogg)$/i)) return "video";
    return "unknown";
  };

  // Determine file type for files being uploaded (based on MIME type)
  const getFileType = (file: File) => {
    const fileType = file.type.split("/")[0]; // "image" or "video"
    if (fileType === "image") return "image";
    if (fileType === "video") return "video";
    return "unknown";
  };

  // Handle media deletion
  const handleDelete = (index: number) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  // Update the images whenever media changes
  useEffect(() => {
    const Images = media.map((m) => ({ imageUrl: m.url }));
    setImages(Images, variantIndex);
  }, [media, variantIndex]);

  return (
    <div className=" w-full">
      <div className="mb-0">
        <h3 className="text-sm font-medium text-gray-700">Media</h3>
        <div className="mt-2 flex gap-3 text-sm">
          <input
            type="file"
            id={`upload${variantIndex}`}
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-stone-50 border  p-4  rounded-md">
        {media.map((item, index) => (
          <div
            key={index}
            className="relative max-w-40 rounded-md  h-fit border-2 border-gray-200"
          >
            {item.fileType === "image" ? (
              <img
                src={item.url}
                alt={`media-${index}`}
                className="w-full object-cover rounded-md shadow-md"
              />
            ) : (
              <video
                controls
                className="w-full object-cover rounded-md shadow-md"
              >
                <source src={item.url} type="video/mp4" />
              </video>
            )}
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-[-5px] right-[-5px] flex justify-center items-center bg-secondary hover:bg-black text-white w-6 h-6 rounded-full  "
            >
              <span className="text-lg">
                <XMarkIcon className="w-4" />
              </span>
            </button>
          </div>
        ))}

        {media.length < 12 && (
          <div className="relative flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md w-full max-w-48 h-40">
            {isUploading ? (
              <div className="text-cetner w-[80%]">
                <div className="text-center mb-2 font-mono">
                  uploading.. ({progressBar}%)
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4  overflow-hidden ">
                  <div
                    className={`bg-black h-4 rounded-full `}
                    style={{ width: `${progressBar}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="bg-black  text-white shadow-sm border text-xs py-1 px-2 rounded-md"
                    onClick={() =>
                      document.getElementById(`upload${variantIndex}`)?.click()
                    }
                  >
                    Upload New
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className=" bg-white text-black shadow-sm border text-xs py-1 px-2 rounded-md"
                  >
                    Add URL
                  </button>
                </div>
                <p className="text-xs text-secondary text-center mt-1">
                  Accepts images, videos
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add Media by URL</h3>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter image or video URL"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddByUrl}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
