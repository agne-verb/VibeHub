"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

type Prompt = {
  id: string;
  vardas: string;
  prompto_tekstas: string;
  created_at: string;
};

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vardas, setVardas] = useState("");
  const [tekstas, setTekstas] = useState("");

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Klaida gaunant promptus:", error.message);
      } else {
        setPrompts(data || []);
      }
    } catch (error) {
      console.error("Netikėta klaida:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vardas.trim() || !tekstas.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("prompts")
        .insert([{ vardas: vardas.trim(), prompto_tekstas: tekstas.trim() }]);

      if (error) {
        alert("Nepavyko pridėti prompto: " + error.message);
      } else {
        setVardas("");
        setTekstas("");
        await fetchPrompts(); // Refresh the list
      }
    } catch (error) {
      alert("Įvyko netikėta klaida.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-5xl px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Promptai
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Dalinkitės ir atraskite bendruomenės sukurtus naudingus promptus.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Formos sekcija */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Pridėti naują promptą
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Jūsų Vardas
                </label>
                <input
                  type="text"
                  value={vardas}
                  onChange={(e) => setVardas(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Pvz. Jonas"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Prompto tekstas
                </label>
                <textarea
                  value={tekstas}
                  onChange={(e) => setTekstas(e.target.value)}
                  className="min-h-[120px] w-full resize-y rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Įveskite savo promptą čia..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Siunčiama...
                  </>
                ) : (
                  "Paskelbti"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sąrašo sekcija */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : prompts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 p-8 text-center">
              <p className="text-lg font-medium text-slate-300">
                Kol kas promptų nėra.
              </p>
              <p className="mt-2 text-slate-500">
                Būkite pirmasis ir pasidalinkite savo idėja!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700 hover:bg-slate-900/60"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-slate-700 bg-slate-800 transition group-hover:border-blue-500">
                        <img
                          src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
                            prompt.vardas
                          )}`}
                          alt={`${prompt.vardas} avatar`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">
                          {prompt.vardas}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {new Date(prompt.created_at).toLocaleDateString("lt-LT")}
                        </span>
                      </div>
                      <div className="mt-3 rounded-lg bg-slate-950/50 p-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300 font-mono">
                          {prompt.prompto_tekstas}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
