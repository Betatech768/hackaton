"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="fixed font-ubuntu bottom-0 right-0 left-0 z-50 bg-zinc-900/30 backdrop-blur-lg flex justify-center items-center p-5">
      <div>
        <p className="flex flex-col">
          © {new Date().getFullYear()} EchoVision. Powered by Gemini 3
          Hackathon.
          <span className="text-sm text-center underline font-ubuntu">
            {pathname === "/" ? (
              <Link href="/docs">View Docs</Link>
            ) : (
              <Link href="/">Home</Link>
            )}
          </span>
        </p>
      </div>
    </footer>
  );
}
