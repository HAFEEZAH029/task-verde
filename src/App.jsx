function App() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-emerald-800 text-white">
            T
          </div>
          <h1 className="text-3xl font-semibold">TaskVerde</h1>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Project scaffold ready
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Simple to-do app setup</h2>
          <p className="mt-3 text-slate-600">
            React, Vite, Tailwind, and the project instructions are in place.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
