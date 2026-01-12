import type { Metadata } from "next";
import { Ubuntu, Poppins, Montserrat } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EchoVision AI",
  description: "EchoVision AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} ${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <section className="fixed top-0 right-0 left-0 z-50 bg-zinc-900/30 backdrop-blur-lg">
          {/* Navbar area */}
          <nav className="flex flex-col justify-center items-center p-10">
            <p className="font-ubuntu text-5xl">EchoVision</p>
            <p className="font-ubuntu p-2">
              Turn hall photos into intelligent speaker placement using Gemini
              AI
            </p>
          </nav>
        </section>
        {children}
        <footer className="fixed font-ubuntu bottom-0 right-0 left-0 z-50 bg-zinc-900/30 backdrop-blur-lg flex justify-center items-center p-5">
          <div>
            <p>
              © {new Date().getFullYear()} EchoVision. Powered by Gemini 3
              Hackathon.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
