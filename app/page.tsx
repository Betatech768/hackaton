"use client";

import Recommendations from "@/components/features/speaker-analysis/Recommendations";
import Tabs from "@/components/features/speaker-analysis/Tabs";
import UploadForm from "@/components/features/speaker-analysis/UploadForm";

export default function Hero() {
  const handleAnalyzeHall = (images: (string | null)[]) => {
    console.log("Uploaded images:", images);
    // 👉 Next step:
    // send images to backend → Gemini → 3D render
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-dvh p-5 font-poppins bg-[url('/heroImage.jpg')] bg-cover bg-no-repeat bg-center pt-60 pb-40">
      <Hero />
      <div className="flex flex-col mt-7 items-center justify-center">
        <UploadForm onAnalyze={handleAnalyzeHall} />
        <Tabs />
      </div>

      <Recommendations />
    </section>
  );
}
