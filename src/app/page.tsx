"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";
import { useHeroes } from "@/hooks/useHeroes";
import { useSearchParams } from "next/navigation";

type SortKey = "name" | "alignment" | "publisher";

export default function RootPage() {
  const [state, setState] = useState({
    page: 1,
    limit: 10,
    searchInput: "",
    search: "",
    showFavorites: false,
    publisher: "",
    sort: "name" as SortKey,
  });

  const { favorites } = useFavorites();
  const { compare, toggle, clear, isComparing } = useCompare();
  const { data, isLoading, heroes } = useHeroes(state, favorites);

  const searchParams = useSearchParams();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setState((s) => ({
        ...s,
        search: s.searchInput,
        page: 1,
      }));
    }, 400);

    return () => clearTimeout(timeout);
  }, [state.searchInput]);

  useEffect(() => {
    const fav = searchParams.get("favorites");
  
    if (fav === "true") {
      setState((s) => ({
        ...s,
        showFavorites: true,
      }));
    }
  }, [searchParams]);

  if (isLoading && !data) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!data) {
    return <p className="text-center mt-10">No data</p>;
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-8 text-slate-100 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <header className="space-y-2">
          <span className="inline-flex rounded-full border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            SuperHeroApi
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Heroes
          </h1>

          <p className="text-sm text-slate-300 sm:text-base">
            Choose a hero to view the complete profile page.
          </p>

          <div className="flex gap-4 mt-4">
            <input
              className="w-full rounded-lg bg-slate-800 p-2"
              placeholder="Buscar herói..."
              value={state.searchInput}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  searchInput: e.target.value,
                }))
              }
            />

            <button
              onClick={() =>
                setState((s) => ({
                  ...s,
                  showFavorites: !s.showFavorites,
                  page: 1,
                  publisher: "",
                }))
              }
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition whitespace-nowrap
                ${
                  state.showFavorites
                    ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-yellow-400/30 hover:text-yellow-300"
                }`}
            >
              {state.showFavorites ? "★" : "☆"} Favorites
              {favorites.length > 0 && (
                <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs text-yellow-300">
                  {favorites.length}
                </span>
              )}
            </button>

            <select
              className="rounded-lg bg-slate-800 p-2 text-slate-300"
              value={state.publisher}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  publisher: e.target.value,
                  page: 1,
                }))
              }
            >
              <option value="">All Publishers</option>
              <option value="Marvel Comics">Marvel</option>
              <option value="DC Comics">DC</option>
            </select>

            <select
              className="rounded-lg bg-slate-800 p-2 text-slate-300"
              value={state.sort}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  sort: e.target.value as SortKey,
                }))
              }
            >
              <option value="name">Name</option>
              <option value="alignment">Alignment</option>
              <option value="publisher">Publisher</option>
            </select>

            <select
              className="rounded-lg bg-slate-800 p-2"
              value={state.limit}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  limit: Number(e.target.value),
                }))
              }
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </header>

        {compare.length === 2 && (
          <div className="bg-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-bold mb-4">Comparação de Heróis</h2>

            <div className="grid grid-cols-2 gap-4">
              {compare.map((hero) => (
                <div key={hero.id} className="bg-slate-900 p-4 rounded">
                  <p className="font-semibold">{hero.name}</p>

                  <p>🧠 Intelligence: {hero.powerstats.intelligence}</p>
                  <p>💪 Strength: {hero.powerstats.strength}</p>
                  <p>⚡ Speed: {hero.powerstats.speed}</p>
                  <p>🛡 Durability: {hero.powerstats.durability}</p>
                  <p>🔥 Power: {hero.powerstats.power}</p>
                  <p>🥊 Combat: {hero.powerstats.combat}</p>
                </div>
              ))}
            </div>

            <button onClick={clear} className="mt-3 text-red-400">
              Limpar comparação
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {heroes.map((hero) => (
            <Link
              key={hero.id}
              href={`/hero/${hero.slug}?favorites=${state.showFavorites}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg transition hover:border-indigo-400/40 hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={hero.images.sm}
                  alt={`Image of ${hero.name}`}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-xl border border-slate-700 object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-white">
                    {hero.name}
                  </p>
                  <p className="text-xs text-slate-400">ID: {hero.id}</p>
                </div>
              </div>


              <div className="mt-4 space-y-1 text-sm text-slate-300">
                <p className="truncate">
                  <span className="text-slate-400">Publisher:</span>{" "}
                  {hero.biography.publisher ?? "Unknown"}
                </p>

                <p className="truncate">
                  <span className="text-slate-400">Alignment:</span>{" "}
                  {hero.biography.alignment}
                </p>

                <p className="truncate">
                  <span className="text-slate-400">Full name:</span>{" "}
                  {hero.biography.fullName || "Unknown secret identity"}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggle(hero);
                }}
                className={`mt-3 w-full rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200
             ${
               isComparing(hero.id)
                 ? "border-red-400/40 bg-red-400/10 text-red-300 hover:bg-red-400/20"
                 : "border-indigo-400/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400"
             }`}
              >
                {isComparing(hero.id) ? "Remover da comparação" : "Comparar"}
              </button>
            </Link>
          ))}
        </div>


        {!state.showFavorites && (
          <>
            <p className="text-center text-sm text-slate-400 mt-4">
              Mostrando {(state.page - 1) * state.limit + 1}–
              {Math.min(state.page * state.limit, data.total)} de {data.total}{" "}
              heróis
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <button
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    page: Math.max(1, s.page - 1),
                  }))
                }
                disabled={state.page === 1}
              >
                ←
              </button>

              {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, state.page - 3),
                  Math.min(data.totalPages, state.page + 2)
                )
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setState((s) => ({ ...s, page: p }))}
                  >
                    {p}
                  </button>
                ))}

              <button
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    page: Math.min(data.totalPages, s.page + 1),
                  }))
                }
                disabled={state.page === data.totalPages}
              >
                →
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
