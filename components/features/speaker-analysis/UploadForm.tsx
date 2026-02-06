"use client";
import React, { useState } from "react";
import NoSRR from "@/app/errorHandling/NoSRR";
import StatusAlert from "@/app/errorHandling/StatusAlert";

type UploadFormProps = {
  onAnalyze?: (images: (HallImage | null)[]) => void;
  loading?: boolean;
  statusCode?: any;
  errorHallImagesNotMatching?: boolean;
};
type HallImage = {
  role: "stage" | "left" | "right" | "back/ceiling";
  dataUrl: string;
};

export default function UploadForm({
  onAnalyze,
  loading,
  statusCode,
  errorHallImagesNotMatching,
}: UploadFormProps) {
  const [selectedImages, setSelectedImages] = useState<(HallImage | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const IMAGE_ROLES = ["stage", "left", "right", "back/ceiling"] as const;

  /**
   * Helper: Converts any image (AVIF, PNG, etc.) to a WebP DataURL
   * This solves the Gemini AVIF compatibility issue.
   */

  const proccessToWebP = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Maintain aspect ration but cap resolution at 2048px
        const scale = Math.min(1, 2048 / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        URL.revokeObjectURL(img.src);
        resolve(dataUrl);
      };
      img.onerror = () => reject("Failed to process image Format");
    });
  };

  // Handle Image Upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const webpDataUrl = await proccessToWebP(file);
      setSelectedImages((prev) => {
        const updated = [...prev];
        updated[index] = {
          role: IMAGE_ROLES[index],
          dataUrl: webpDataUrl,
        };
        return updated;
      });
      // clear error
      setDisplayError(null);
    } catch (err) {
      setDisplayError(
        "Could not process this image format. Try a JPEG or PNG.",
      );
    }
  };

  // Post Request and Error Message for Images Less than 4
  const handleAnalyze = () => {
    if (selectedImages.filter(Boolean).length < 4) {
      setDisplayError("Please Upload 4 Images of Venue");
    } else {
      onAnalyze?.(selectedImages);
    }
  };

  return (
    <NoSRR>
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold text-white mb-2 text-center">
          Upload Hall Images
        </h2>

        <p className="text-zinc-400 text-center mb-6">
          Upload 4 images: Stage, Left, Right, Back, and Ceiling views.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {["Stage", "Left", "Right", "Back/Ceiling"].map((view, index) => (
            <div key={view} className="flex flex-col items-center">
              <label
                htmlFor={`upload-${index}`}
                className="cursor-pointer w-full aspect-square bg-zinc-700/50 rounded-lg border-2 border-dashed border-zinc-600 hover:border-red-500 transition-colors flex items-center justify-center overflow-hidden group relative"
              >
                {selectedImages[index] ? (
                  <img
                    src={selectedImages[index]!.dataUrl}
                    alt={`${view} view`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-zinc-500 group-hover:text-red-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-zinc-500 text-sm mt-2 group-hover:text-red-400">
                      Upload
                    </span>
                  </div>
                )}
              </label>

              <input
                id={`upload-${index}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, index)}
                disabled={loading}
              />

              <span className="text-white text-sm mt-2">{view}</span>
            </div>
          ))}
        </div>

        {selectedImages.filter(Boolean).length < 4 && (
          <div className="flex justify-center m-2">
            <p className="text-sm text-red-600">{displayError}</p>
          </div>
        )}

        {errorHallImagesNotMatching && (
          <div className="flex justify-center m-2">
            <p className="text-sm text-red-600 flex flex-col text-center">
              Some or all of uploaded images do not belong to the same venue.
              click on the images to re-upload the correct ones.
            </p>
          </div>
        )}

        <StatusAlert statusCode={statusCode} />
        <div className="flex justify-center">
          <button
            className="button"
            disabled={selectedImages.filter(Boolean).length === 0 || loading}
            onClick={handleAnalyze}
          >
            <div className="dots_border"></div>
            <span className="text_button flex items-center gap-2">
              {loading && (
                <svg className="loader relative" viewBox="25 25 50 50">
                  <circle r="20" cy="50" cx="50"></circle>
                </svg>
              )}
              {loading ? "Analyzing Hall" : "Analyze Hall"}
            </span>
          </button>
        </div>
      </div>
    </NoSRR>
  );
}
