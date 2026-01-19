export default function Footer() {
  return (
    <footer className="fixed font-ubuntu bottom-0 right-0 left-0 z-50 bg-zinc-900/30 backdrop-blur-lg flex justify-center items-center p-5">
      <div>
        <p>
          © {new Date().getFullYear()} EchoVision. Powered by Gemini 3
          Hackathon.
        </p>
      </div>
    </footer>
  );
}
