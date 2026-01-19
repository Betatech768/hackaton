"use client";
import Tabs from "./Tabs";
import Recommendations from "./Recommendations";
import UploadForm from "./UploadForm";

export default function Hero() {
  const handleAnalyzeHall = (images: (string | null)[]) => {
    console.log("Uploaded images:", images);
    // 👉 Next step:
    // send images to backend → Gemini → 3D render
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-dvh p-5 font-poppins bg-[url('/heroImage.jpg')] bg-cover bg-no-repeat bg-center pt-60 pb-40">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Intelligent Speaker Placement.
        </h1>

        <p className="text-lg md:text-xl text-white/90">
          Instantly upload your hall photos and let{" "}
          <span className="text-blue-400 font-semibold">Gemini AI</span> predict
          the best speaker positions — in{" "}
          <span className="text-blue-400 font-semibold">2D</span>,{" "}
          <span className="text-blue-400 font-semibold">3D</span>, VR & AR.
        </p>
      </div>

      <div className="flex flex-col mt-7 items-center justify-center">
        <UploadForm onAnalyze={handleAnalyzeHall} />
        <Tabs />
      </div>

      <Recommendations />
    </section>
  );
}
