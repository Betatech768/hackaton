"use client";
import Link from "next/link";
import { useState } from "react";

// Types
import {
  Dimensions,
  SeatingAreaProps,
  SpeakerPosition,
  StageData,
} from "@/types/speaker";

// components
import EchoVision2D from "@/views/2D/EchoVision2D";
import EchoVision3D from "@/views/3D/EchoVision3D";
import EchoVisionVr from "@/views/VR/EchoVisionVr";
import NoSRR from "@/app/errorHandling/NoSRR";

type Props = {
  dimensions?: Dimensions;
  speakerPosition?: SpeakerPosition[];
  stage_area?: StageData;
  seating_area?: SeatingAreaProps;
};

export default function Tabs({
  dimensions,
  speakerPosition,
  stage_area,
  seating_area,
}: Props) {
  const [activeTab, setActiveTab] = useState("2d");

  // Helper to handle tab classes and fix the 'whute' typo
  const getTabClass = (id: string) =>
    `px-4 py-2 font-medium transition-colors ${
      activeTab === id
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-white hover:text-blue-500"
    }`;

  return (
    <section className="flex flex-col items-center p-4 sm:p-6 md:p-8 lg:p-10 min-h-[60dvh] bg-zinc-800/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-lg shadow-lg p-6">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between w-full border-b border-gray-300 pb-2 mb-6 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab("2d")}
            className={getTabClass("2d")}
          >
            2D Placement
          </button>
          <button
            onClick={() => setActiveTab("3d")}
            className={getTabClass("3d")}
          >
            3D Placement
          </button>
          <button
            onClick={() => setActiveTab("vr")}
            className={getTabClass("vr")}
          >
            VR Experience
          </button>
          <button
            onClick={() => setActiveTab("ar")}
            className={getTabClass("ar")}
          >
            AR View
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-400px">
          {activeTab === "2d" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-white text-center">
                2D Floor Plan
              </h2>
              <p className="text-zinc-300 mb-6 text-center">
                Arrange objects in a traditional 2D layout.
              </p>
              <div className="w-full max-w-4xl mx-auto">
                <div className="relative w-full aspect-5/8 max-h-[70vh]">
                  <EchoVision2D
                    dimensions={dimensions}
                    speakerPosition={speakerPosition}
                    stage_area={stage_area}
                    seating_area={seating_area}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "3d" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-white text-center">
                3D Render
              </h2>
              <p className="text-zinc-300 mb-6 flex flex-col text-center">
                Interactive 3D environment.
                <span className="text-xs text-zinc-500 italic">
                  Drag to Orbit • Scroll to Zoom
                </span>
              </p>
              <div className="aspect-video bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                <NoSRR>
                  <EchoVision3D
                    dimensions={dimensions}
                    speakers={speakerPosition}
                    stage_area={stage_area}
                    seating_area={seating_area}
                  />
                </NoSRR>
              </div>
            </div>
          )}

          {activeTab === "vr" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-white text-center">
                WebXR (VR)
              </h2>
              <p className="text-zinc-300 mb-6 flex flex-col text-center">
                Immersive placement for VR headsets.
                <span className="text-xs text-blue-400 underline">
                  <Link href="/docs/#how-to-vr">Check VR Requirements</Link>
                </span>
              </p>
              <div className="aspect-video bg-zinc-900 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                <NoSRR>
                  <EchoVisionVr
                    dimensions={dimensions}
                    speakers={speakerPosition}
                    stage_area={stage_area}
                    seating_area={seating_area}
                  />
                </NoSRR>
              </div>
            </div>
          )}

          {activeTab === "ar" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-white text-center">
                Augmented Reality
              </h2>
              <div className="aspect-video bg-zinc-900 rounded-xl border border-dashed border-zinc-700 flex items-center justify-center">
                <span className="text-zinc-500 font-medium">
                  AR Experience Coming Soon...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tailwind handles the animation via globals.css or keep this for scoped styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  );
}
