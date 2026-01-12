"use client";
import React, { JSX, useState } from "react";

export default function Hero(): JSX.Element {
  const [selectedImages, setSelectedImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  //Function to add image
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...selectedImages];
        newImages[index] = reader.result as string;
        setSelectedImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };
  //Function to remove image
  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages[index] = null;
    setSelectedImages(newImages);
  };
  return (
    <section className="flex flex-col items-center justify-center min-h-dvh p-5 font-poppins bg-[url('/heroImage.jpg')] bg-cover bg-no-repeat bg-center pt-60 pb-40">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Intelligent Speaker Placement.
        </h1>
        <p className="text-lg md:text-xl text-white/90 font">
          Instantly Upload your hall photos, and{" "}
          <span className="text-blue-400 font-semibold">let Gemini</span> AI
          predict the best positions for
          <span className="text-blue-400 font-semibold"> main</span> and delay
          speakers — in <span className="text-blue-400 font-semibold">2</span>D,{" "}
          <span className="text-blue-400 font-semibold">3</span>D, AR, and VR.
        </p>
      </div>
      <div className="flex flex-col mt-7 items-center justify-center">
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
                  className="cursor-pointer w-full aspect-square bg-zinc-700/50 rounded-lg border-2 border-dashed border-zinc-600 hover:border-red-500 transition-colors flex flex-col items-center justify-center overflow-hidden group relative"
                >
                  {selectedImages[index] ? (
                    <>
                      <img
                        src={selectedImages[index]}
                        alt={`${view} view`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveImage(index);
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Remove image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
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
                      <span className="text-zinc-500 text-sm mt-2 group-hover:text-red-400 transition-colors">
                        Upload
                      </span>
                    </>
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
            >
              <div className="dots_border"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="sparkle"
              >
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                ></path>
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                ></path>
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                ></path>
              </svg>
              <span className="text_button">Analyze Hall</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
