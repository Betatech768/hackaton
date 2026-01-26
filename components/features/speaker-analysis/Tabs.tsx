"use client";

// Types
import { Dimensions, SpeakerPosition, StageData } from "@/types/speaker";
import { useState } from "react";

// components
import EchoVision2D from "@/views/2D/EchoVision2D";
import EchoVision3D from "@/views/3D/EchoVision3D";

type Props = {
  dimensions?: Dimensions;
  speakerPosition?: SpeakerPosition[];
  stage_area?: StageData;
};

export default function Tabs({
  dimensions,
  speakerPosition,
  stage_area,
}: Props) {
  const [activeTab, setActiveTab] = useState("2d");

  return (
    <section className="flex flex-col items-center p-4 sm:p-6 md:p-8 lg:p-10 min-h-[60dvh] bg-zinc-800/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-lg shadow-lg p-6">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between w-full border-b border-gray-300 pb-2 mb-6">
          <button
            onClick={() => setActiveTab("2d")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "2d"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-whute hover:text-blue-500"
            }`}
          >
            2D Placement View
          </button>
          <button
            onClick={() => setActiveTab("3d")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "3d"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-whute hover:text-blue-500"
            }`}
          >
            3D Placement View
          </button>
          <button
            onClick={() => setActiveTab("vr")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "vr"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-whute hover:text-blue-500"
            }`}
          >
            VR Placement View
          </button>
          <button
            onClick={() => setActiveTab("ar")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "ar"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-whute hover:text-blue-500"
            }`}
          >
            AR Placement View
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-100">
          {activeTab === "2d" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-white text-center">
                2D Placement View
              </h2>
              <p className="text-white mb-6 text-center">
                View and arrange objects in a traditional 2D floor plan layout.
              </p>
              <div className="w-full max-w-4xl mx-auto ">
                <div className="relative w-full aspect-5/8 max-h-[70vh]">
                  <EchoVision2D
                    dimensions={dimensions}
                    speakerPosition={speakerPosition}
                    stage_area={stage_area}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "3d" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-white text-center">
                3D Placement View
              </h2>
              <p className="text-whute mb-6 flex flex-col text-center">
                Interact with objects in a fully rendered 3D environment.
                <span className="text-sm text-center text-gray-400 italic font-ubuntu">
                  Click and Drag to Pan, scroll to zoom in and out.
                </span>
              </p>
              <div className="aspect-video bg-linear-to-b from-blue-100 to-blue-50 rounded border border-gray-300 flex items-center justify-center">
                <EchoVision3D
                  dimensions={dimensions}
                  speakers={speakerPosition}
                  stage_area={stage_area}
                />
              </div>
            </div>
          )}

          {activeTab === "vr" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-white">
                VR Placement View
              </h2>
              <p className="text-whute mb-6">
                Experience immersive virtual reality placement with VR headset
                support.
              </p>
              <div className="aspect-video bg-linear-to-br from-purple-100 to-pink-50 rounded border border-gray-300 flex items-center justify-center">
                {/* Place three.js VR Output here */}
                <span className="text-gray-400">VR Experience</span>
              </div>
            </div>
          )}

          {activeTab === "ar" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-white">
                AR Placement View
              </h2>
              <p className="text-whute mb-6">
                Visualize objects in your real environment using augmented
                reality.
              </p>
              <div className="aspect-video bg-linear-to-br from-green-100 to-cyan-50 rounded border border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">AR View Coming Soon</span>
              </div>
            </div>
          )}
        </div>
      </div>

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
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
}
