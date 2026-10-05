"use client";

import SmartGrid3D from "@/components/SmartGrid3D";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">

      {/* Header */}
      <header className="border-b border-cyan-400/10 bg-[#020617]/90 px-8 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              SmartGrid <span className="text-cyan-400">AI</span>
            </h1>

            <p className="text-sm text-slate-400">
              Intelligent Energy Consumption & Management
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-sm text-emerald-300">
              AI System Online
            </span>
          </div>

        </div>
      </header>


      {/* Hero */}
      <section className="mx-auto max-w-7xl px-8 pt-12">

        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            AI Energy Intelligence
          </p>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            The Future of
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Smart Energy
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Monitor energy consumption, predict future demand and
            intelligently manage your power network using machine learning.
          </p>
        </div>


        {/* 3D SmartGrid */}
        <SmartGrid3D />


        {/* Stats */}
        <div className="grid gap-5 py-8 md:grid-cols-3">

          <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">
              Current Prediction
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-400">
              4.21 kW
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Random Forest AI Model
            </p>
          </div>


          <div className="rounded-2xl border border-emerald-400/10 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">
              Model Accuracy
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              99.90%
            </p>

            <p className="mt-2 text-sm text-slate-500">
              R² score
            </p>
          </div>


          <div className="rounded-2xl border border-purple-400/10 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">
              AI Status
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-400">
              ONLINE
            </p>

            <p className="mt-2 text-sm text-slate-500">
              FastAPI prediction service
            </p>
          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-slate-800 px-8 py-6 text-center text-sm text-slate-500">
        SmartGrid AI • Intelligent Energy Consumption Prediction & Management
      </footer>

    </main>
  );
}