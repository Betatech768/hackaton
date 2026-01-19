"use client";
import React, { useState } from "react";

type UploadFormProps = {
  onAnalyze?: (images: (string | null)[]) => void;
};

export default function UploadForm({ onAnalyze }: UploadFormProps) {
  const [selectedImages, setSelectedImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImages((prev) => {
        const updated = [...prev];
        updated[index] = reader.result as string;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    onAnalyze?.(selectedImages);
  };

  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full">
      <h2 className="text-2xl font-semibold text-white mb-2 text-center">
        Upload Hall Images
      </h2>

      <p className="text-zinc-400 text-center mb-6">
        Upload up to 4 images: Stage, Left, Right, Back, and Ceiling views
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
                  src={selectedImages[index]!}
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
            />

            <span className="text-white text-sm mt-2">{view}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          className="button"
          disabled={selectedImages.filter(Boolean).length === 0}
          onClick={handleAnalyze}
        >
          <div className="dots_border"></div>
          <span className="text_button">Analyze Hall</span>
        </button>
      </div>
    </div>
  );
}
