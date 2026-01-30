import Link from "next/link";
import React from "react";

function Docs() {
  return (
    <>
      <article className="max-w-4xl mx-auto p-6 text-white leading-relaxed mt-50 mb-50">
        <header className="mb-12 border-b border-zinc-700 pb-8">
          <h1 className="text-4xl font-bold mb-4">EchoVision Documentation</h1>
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Overview
            </h2>
            <p className="mb-4">
              EchoVision is a spatial sound-planning platform that helps
              musicians, churches, and live venues understand how sound behaves
              in a room <strong>before installation or performance</strong>.
            </p>
            <p>
              By combining Gemini-powered image analysis with 2D, 3D, and VR
              visualization, EchoVision turns real spaces into interactive sound
              models. This allows users to identify coverage gaps, poor speaker
              placement, and acoustic risks early — saving time, money, and
              frustration.
            </p>
            <p className="mt-4 italic text-zinc-400">
              EchoVision is designed for people who work with sound, not against
              them.
            </p>
          </section>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Core Concept
          </h2>
          <p className="mb-6">
            Traditional sound planning relies heavily on experience, guesswork,
            or expensive site visits. EchoVision introduces a smarter workflow:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mb-6">
            <li>Upload images of the venue</li>
            <li>Let Gemini analyze spatial and acoustic cues</li>
            <li>Visualize the results in 2D, 3D, or VR</li>
            <li>Make informed decisions before deployment</li>
          </ol>
          <p className="font-bold text-lg text-center bg-zinc-900 p-4 rounded-lg">
            The goal is simple:{" "}
            <span className="text-blue-500 underline decoration-2 underline-offset-4">
              see sound before it fails
            </span>
            .
          </p>
        </section>

        <hr className="border-zinc-700 mb-12" />

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">
            How EchoVision Works
          </h2>

          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold mb-3">1. Image Input</h3>
              <p className="mb-3">
                Users upload images of the space, typically including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Stage view</li>
                <li>Left side</li>
                <li>Right side</li>
                <li>Back or ceiling view</li>
              </ul>
              <p className="mt-2 text-sm text-zinc-400">
                Each image is tagged with its role to give Gemini proper spatial
                context.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">
                2. Gemini Spatial Analysis
              </h3>
              <p className="mb-4">
                Gemini processes the images using multimodal reasoning to infer:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Hall dimensions and orientation</li>
                <li>Stage size and position</li>
                <li>Speaker placement and aiming angles</li>
                <li>Speaker roles (main, subwoofer, delay, fill)</li>
                <li>
                  Acoustic risk areas (coverage gaps, reflections, obstruction
                  zones)
                </li>
              </ul>
              <p className="mt-4">
                Instead of returning a wall of text, Gemini produces{" "}
                <strong>structured spatial data</strong> — positions, angles,
                and roles — that behaves like a real system design model.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">3. 2D Visualization</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Hall outline scaled to real dimensions</li>
                <li>Stage placement</li>
                <li>Speaker positions and orientations</li>
                <li>Coverage cones showing horizontal dispersion</li>
                <li>Color-coded speaker types for clarity</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">4. 3D Visualization</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full hall geometry with walls, floor, and height</li>
                <li>Elevated speakers and stage platforms</li>
                <li>Accurate speaker aiming (horizontal & vertical angles)</li>
                <li>Interactive camera controls for inspection</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">5. VR Walkthrough</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Walk through the venue at human eye level</li>
                <li>View speaker coverage from the audience perspective</li>
                <li>Identify dead zones and overlap intuitively</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">
                6. Recommendations & Cost Awareness
              </h3>
              <p className="mb-3">
                Gemini identifies potential issues such as:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Poor coverage distribution, over-angled mains, or
                  under-balcony dead zones.
                </li>
              </ul>
              <p>
                For each issue, EchoVision provides suggested fixes, practical
                alternatives, and <strong>estimated cost ranges</strong> to
                ensure decisions are realistic.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 p-6 bg-zinc-900/50 border border-zinc-700 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Key Features
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li className="flex items-center">✓ Gemini spatial reasoning</li>
            <li className="flex items-center">
              ✓ 2D, 3D, and VR visualization
            </li>
            <li className="flex items-center">✓ Structured acoustic data</li>
            <li className="flex items-center">✓ Speaker coverage modeling</li>
            <li className="flex items-center">✓ Cost-aware recommendations</li>
            <li className="flex items-center">✓ User-friendly interface</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Design Philosophy
          </h2>
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic space-y-4">
            <p>
              <strong>Clarity</strong> – Visualize sound, don’t guess
            </p>
            <p>
              <strong>Empathy</strong> – Built by someone who has mixed sound in
              real rooms
            </p>
            <p>
              <strong>Practicality</strong> – Every recommendation considers
              cost and feasibility
            </p>
          </blockquote>
        </section>

        <footer className="mt-16 pt-8 border-t border-zinc-700 text-zinc-400 text-sm">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Limitations & Future Improvements
          </h2>
          <p className="mb-4">
            EchoVision provides informed modeling, not a replacement for
            certified acoustic measurement tools.
          </p>
          <p>
            Planned: Frequency-specific modeling, real-time SPL simulation / AR,
            and exportable technical reports.
          </p>
        </footer>
      </article>
    </>
  );
}

export default Docs;
