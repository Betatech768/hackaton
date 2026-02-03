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
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const handleAnalyzeHall = async (images: (HallImage | null)[]) => {
    const imagesToSend = images.filter(Boolean);

    if (imagesToSend.length === 0) return;

    setLoading(true);
    setErrorCode(null);

    // Calling Server Route
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: imagesToSend }),
      });

      if (!res.ok) {
        throw new Error(res.status.toString());
      }
      const result = await res.json();

      console.log("Gemini Analysis Result:", result);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error("Error analysis hall:", err);
      const code = parseInt(err.message);
      setErrorCode(isNaN(code) ? 500 : code);
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
    speaker_recommendations,
    all_speaker_positions,
    dimensions,
    seating_capacity_estimate,
    seating_area,
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
          <UploadForm
            onAnalyze={handleAnalyzeHall}
            loading={loading}
            statusCode={errorCode}
          />
        )}
        {analysisResult && (
          <Tabs
            dimensions={dimensions}
            speakerPosition={all_speaker_positions}
            stage_area={stage_area}
            seating_area={seating_area}
          />
        )}
      </div>

      {analysisResult && (
        <Recommendations
          room={room_type}
          seating_cap={seating_capacity_estimate}
          roomStatus={room_status}
          criticalIssues={hallIssues}
          recommendedFixes={recommended_fixes}
          totalEstimatedCost={total_estimated_cost_usd}
          speakers={speaker_recommendations}
        />
      )}
    </section>
  );
}
