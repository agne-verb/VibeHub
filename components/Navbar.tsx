import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4 text-white shadow-lg backdrop-blur">
      <h1 className="text-2xl font-bold tracking-tight text-blue-400">VibeHub 🎯</h1>
      <div className="space-x-6 text-sm font-medium sm:text-base">
        <Link href="/prompts" className="transition hover:text-blue-300">
          Promptai
        </Link>
        <Link href="/tools" className="transition hover:text-blue-300">
          Įrankiai
        </Link>
      </div>
    </nav>
  );
}
