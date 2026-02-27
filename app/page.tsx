export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center px-6 py-20">
      <section className="space-y-6">
        <p className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
          VibeHub
        </p>
        <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
          Sveiki atvykę į VibeHub - programuotojų resursų centrą
        </h2>
        <p className="max-w-2xl text-lg text-slate-400">
          Promptai, įrankiai ir praktiniai šaltiniai vienoje vietoje.
        </p>
      </section>
    </main>
  );
}
