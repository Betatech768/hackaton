export default function Header() {
  return (
    <section className="fixed top-0 right-0 left-0 z-50 bg-zinc-900/30 backdrop-blur-lg">
      {/* Navbar area */}
      <nav className="flex flex-col justify-center items-center p-10">
        <p className="font-ubuntu text-5xl">EchoVision</p>
        <p className="font-ubuntu p-2">
          Turn hall photos into intelligent speaker placement using Gemini AI
        </p>
      </nav>
    </section>
  );
}
