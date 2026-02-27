"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ToolItem = {
  id: number;
  pavadinimas: string;
  url_nuoroda: string;
  aprasymas: string;
};

export default function ToolsPage() {
  const [joke, setJoke] = useState("Kraunamas programavimo juokelis...");
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [pavadinimas, setPavadinimas] = useState("");
  const [urlNuoroda, setUrlNuoroda] = useState("");
  const [aprasymas, setAprasymas] = useState("");

  const loadTools = async () => {
    setLoadingTools(true);
    const { data, error: selectError } = await supabase
      .from("tools")
      .select("id, pavadinimas, url_nuoroda, aprasymas")
      .order("id", { ascending: false });

    if (selectError) {
      setError(selectError.message);
    } else {
      setTools((data as ToolItem[]) ?? []);
    }
    setLoadingTools(false);
  };

  useEffect(() => {
    const loadJoke = async () => {
      try {
        const response = await fetch(
          "https://v2.jokeapi.dev/joke/Programming?type=single"
        );
        if (!response.ok) {
          throw new Error("Nepavyko gauti juokelio.");
        }
        const data = (await response.json()) as { joke?: string };
        setJoke(data.joke ?? "Šį kartą juokelio gauti nepavyko.");
      } catch {
        setJoke("Šį kartą juokelio gauti nepavyko.");
      }
    };

    loadJoke();
    void loadTools();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const { error: insertError } = await supabase.from("tools").insert({
      pavadinimas,
      url_nuoroda: urlNuoroda,
      aprasymas,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setPavadinimas("");
    setUrlNuoroda("");
    setAprasymas("");
    await loadTools();
    setSaving(false);
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-5xl space-y-10 px-6 py-12">
      <section className="rounded-2xl border border-blue-500/30 bg-slate-900 p-6 shadow-lg">
        <h2 className="text-2xl font-bold tracking-tight text-blue-300">
          Programavimo juokelis
        </h2>
        <p className="mt-4 text-slate-200">{joke}</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-slate-100">Naujas įrankis</h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            type="text"
            placeholder="Pavadinimas"
            value={pavadinimas}
            onChange={(event) => setPavadinimas(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-400"
            required
          />
          <input
            type="url"
            placeholder="URL nuoroda"
            value={urlNuoroda}
            onChange={(event) => setUrlNuoroda(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-400"
            required
          />
          <textarea
            placeholder="Aprašymas"
            value={aprasymas}
            onChange={(event) => setAprasymas(event.target.value)}
            className="min-h-28 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-400"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-500 px-5 py-2.5 font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saugoma..." : "Išsaugoti"}
          </button>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-slate-100">Visi įrankiai</h3>

        {loadingTools ? (
          <p className="mt-4 text-slate-400">Kraunamas sąrašas...</p>
        ) : tools.length === 0 ? (
          <p className="mt-4 text-slate-400">Įrašų dar nėra.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {tools.map((tool) => (
              <article
                key={tool.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <h4 className="text-lg font-semibold text-blue-300">
                  {tool.pavadinimas}
                </h4>
                <a
                  href={tool.url_nuoroda}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-blue-400 transition hover:text-blue-300"
                >
                  {tool.url_nuoroda}
                </a>
                <p className="mt-2 text-slate-300">{tool.aprasymas}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
