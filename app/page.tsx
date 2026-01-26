"use client";

import { useState } from "react";

// Types
import { AnalysisResult } from "@/types/speaker";

// components
import Hero from "@/components/features/speaker-analysis/Hero";
import Recommendations from "@/components/features/speaker-analysis/Recommendations";
import Tabs from "@/components/features/speaker-analysis/Tabs";
import UploadForm from "@/components/features/speaker-analysis/UploadForm";

type HallImage = {
  role: "stage" | "left" | "right" | "back/ceiling";
  dataUrl: string;
};

export default function EchoVision() {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    null as AnalysisResult | null,
  );
  const handleAnalyzeHall = async (images: (HallImage | null)[]) => {
    const imagesToSend = images.filter(Boolean);
    console.log("Images to send for analysis:", imagesToSend);

    if (imagesToSend.length === 0) return;
    setLoading(true);

    // Calling Server Route
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: imagesToSend }),
      });
      const result = await res.json();

      console.log("Gemini Analysis Result:", result);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Error analysis hall:", err);
    } finally {
      setLoading(false);
    }
  };

  const {
    critical_issues,
    recommended_fixes,
    total_estimated_cost_usd,
    room_type,
    room_status,
    stage_area,
    analysis_summary,
    speaker_recommendations,
    all_speaker_positions,
    placement_views,
    dimensions,
  } = analysisResult || {};

  const hallIssues = critical_issues?.map(
    ({ description, impact, severity, title }) => ({
      description,
      impact,
      severity,
      title,
    }),
  );

  return (
    <section className="flex flex-col items-center justify-center min-h-dvh p-5 font-poppins bg-[url('/heroImage.jpg')] bg-cover bg-no-repeat bg-center pt-60 pb-40">
      <Hero />
      <div className="flex flex-col mt-7 items-center justify-center">
        {!analysisResult && (
          <UploadForm onAnalyze={handleAnalyzeHall} loading={loading} />
        )}
        {analysisResult && (
          <Tabs
            dimensions={dimensions}
            speakerPosition={all_speaker_positions}
            stage_area={stage_area}
          />
        )}
      </div>

      {analysisResult && (
        <Recommendations
          room={room_type}
          roomStatus={room_status}
          criticalIssues={hallIssues}
          recommendedFixes={recommended_fixes}
          totalEstimatedCost={total_estimated_cost_usd}
        />
      )}
    </section>
  );
}
