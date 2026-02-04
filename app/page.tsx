"use client";

import { useState } from "react";
import { AnalysisResult } from "@/types/speaker";
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [errorCode, setErrorCode] = useState<number | null>(null);

  // --- Logic for Small Room Detection ---
  // Threshold: 60 square meters
  const roomWidth = analysisResult?.dimensions?.width_m ?? 0;
  const roomDepth = analysisResult?.dimensions?.length_m ?? 0;
  const isSmallRoom = roomWidth * roomDepth > 0 && roomWidth * roomDepth < 60;

  const handleAnalyzeHall = async (images: (HallImage | null)[]) => {
    const imagesToSend = images.filter(Boolean);
    if (imagesToSend.length === 0) return;

    setLoading(true);
    setErrorCode(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imagesToSend }),
      });

      if (!res.ok) throw new Error(res.status.toString());
      const result = await res.json();
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

      <div className="flex flex-col mt-7 items-center justify-center w-full">
        {/* 1. UPLOAD STATE */}
        {!analysisResult && (
          <UploadForm
            onAnalyze={handleAnalyzeHall}
            loading={loading}
            statusCode={errorCode}
          />
        )}

        {/* 2. SMALL ROOM ROADMAP STATE (Coming Soon Feedback) */}
        {analysisResult && isSmallRoom && (
          <div className="bg-zinc-900/80 backdrop-blur-md border border-blue-500/30 rounded-2xl p-8 max-w-2xl text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Small Venue Detected
            </h3>
            <p className="text-zinc-400 mb-6">
              Your room is approximately{" "}
              <strong>{roomWidth * roomDepth}m²</strong>. EchoVision is
              currently optimized for professional concert halls and large
              venues.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-400 text-sm font-medium">
                🚀 Roadmap Feature: Near-field studio monitoring and small-room
                acoustic treatment analysis is coming in v2.0.
              </p>
            </div>
            <button
              onClick={() => setAnalysisResult(null)}
              className="mt-8 text-zinc-500 hover:text-white transition-colors text-sm underline"
            >
              Upload a different venue
            </button>
          </div>
        )}

        {/* 3. FULL SUCCESS STATE (Large Halls) */}
        {analysisResult && !isSmallRoom && (
          <>
            <Tabs
              dimensions={dimensions}
              speakerPosition={all_speaker_positions}
              stage_area={stage_area}
              seating_area={seating_area}
            />
            <Recommendations
              room={room_type}
              seating_cap={seating_capacity_estimate}
              roomStatus={room_status}
              criticalIssues={hallIssues}
              recommendedFixes={recommended_fixes}
              totalEstimatedCost={total_estimated_cost_usd}
              speakers={speaker_recommendations}
            />
          </>
        )}
      </div>
    </section>
  );
}
