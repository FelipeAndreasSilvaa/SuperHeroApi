"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";
import { useHeroes } from "@/hooks/useHeroes";
import { useSearchParams } from "next/navigation";

import { useTheme } from "@/hooks/useTheme";
import { HeroCardSkeleton } from "@/components/ui/HeroCardSkeleton";

type SortKey = "name" | "alignment" | "publisher" | "id";


export default function RootPage() {
  const [state, setState] = useState({
    page: 1,
    limit: 10,
    searchInput: "",
    search: "",
    showFavorites: false,
    publisher: "",
    sort: "name" as SortKey,
    favoritesPage: 1,
    direction: "asc" as "asc" | "desc",
  });

  const { favorites } = useFavorites();
  const { compare, toggle, clear, isComparing } = useCompare();
  const { data, isLoading, heroes } = useHeroes(state, favorites);

  const { theme, toggleTheme } = useTheme();

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
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <HeroCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (!data) {
    return <p className="text-center mt-10">No data</p>;
  }

  const FAVORITES_LIMIT = 10;

  const visibleHeroes = state.showFavorites
    ? heroes.slice(
        (state.favoritesPage - 1) * FAVORITES_LIMIT,
        state.favoritesPage * FAVORITES_LIMIT
      )
    : heroes;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-linear-to-br dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 px-4 py-8 text-black dark:text-slate-100 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <header className="space-y-2">
          <span className="inline-flex rounded-full border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            SuperHeroApi
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Heroes
          </h1>

          <p className="text-sm text-gray-600 dark:text-slate-300 sm:text-base">
            Choose a hero to view the complete profile page.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <input
              className="flex-1 min-w-[180px] rounded-xl bg-white text-gray-800 dark:bg-slate-800 dark:text-white px-3 py-2 border border-gray-300 dark:border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-sm
              ${
                state.showFavorites
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 shadow-yellow-200/50 dark:bg-yellow-400/10 dark:text-yellow-300 dark:border-yellow-400/30 dark:hover:bg-yellow-400/20"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-yellow-400/30 dark:hover:text-yellow-300"
              }`}
                  >
              {state.showFavorites ? "★" : "☆"} Favorites
              {favorites.length > 0 && (
                <span
                  className="ml-1 rounded-full px-2 py-0.5 text-xs font-bold
                bg-yellow-200 text-yellow-800
                dark:bg-yellow-400/20 dark:text-yellow-300"
                >
                  {favorites.length}
                </span>
              )}
            </button>

            <select
              className="rounded-xl bg-white text-gray-800 dark:bg-slate-800 dark:text-slate-300 px-3 py-2 border border-gray-300 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition"
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
              className="rounded-xl bg-white text-gray-800 dark:bg-slate-800 dark:text-slate-300 px-3 py-2 border border-gray-300 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition"
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
              <option value="id">ID</option>
            </select>

            <select
              className="rounded-xl bg-white text-gray-800 dark:bg-slate-800 dark:text-slate-300 px-3 py-2 border border-gray-300 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              value={state.direction}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  direction: e.target.value as "asc" | "desc",
                }))
              }
            >
              <option value="asc">Asc ↑</option>
              <option value="desc">Desc ↓</option>
            </select>

            <select
              className="rounded-xl bg-white text-gray-800 dark:bg-slate-800 dark:text-slate-300 px-3 py-2 border border-gray-300 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition"
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
              <option value={100}>100</option>
            </select>

            <button
              onClick={toggleTheme}
              className="rounded-xl px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-sm transition dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        </header>

        {compare.length === 2 && (
          <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            Comparação de Heróis
          </h2>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {compare.map((hero) => (
              <div
                key={hero.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm"
              >
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  {hero.name}
                </p>
        
                <div className="space-y-1 text-sm text-gray-700 dark:text-slate-300">
                  <p>🧠 Intelligence: {hero.powerstats.intelligence}</p>
                  <p>💪 Strength: {hero.powerstats.strength}</p>
                  <p>⚡ Speed: {hero.powerstats.speed}</p>
                  <p>🛡 Durability: {hero.powerstats.durability}</p>
                  <p>🔥 Power: {hero.powerstats.power}</p>
                  <p>🥊 Combat: {hero.powerstats.combat}</p>
                </div>
              </div>
            ))}
          </div>
        
          <button
            onClick={clear}
            className="mt-4 text-red-500 hover:text-red-600 font-medium transition"
          >
            Limpar comparação
          </button>
        </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleHeroes.map((hero) => (
            <Link
              key={hero.id}
              href={`/hero/${hero.slug}?favorites=${state.showFavorites}`}
              className="group rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 dark:hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={hero.images.sm}
                  alt={`Image of ${hero.name}`}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-xl border border-gray-300 dark:border-slate-700 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                    {hero.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    ID: {hero.id}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-slate-300">
                <p className="truncate">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">
                    Publisher:
                  </span>{" "}
                  {hero.biography.publisher ?? "Unknown"}
                </p>

                <p className="truncate">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">
                    Alignment:
                  </span>{" "}
                  {hero.biography.alignment}
                </p>

                <p className="truncate">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">
                    Full name:
                  </span>{" "}
                  {hero.biography.fullName || "Unknown secret identity"}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggle(hero);
                }}
                className={`mt-4 w-full rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 shadow-sm
              ${
                isComparing(hero.id)
                  ? "border-red-300 bg-red-100 text-red-700 hover:bg-red-200 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/20"
                  : "border-indigo-300 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:border-indigo-400/40 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
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

            <div className="flex flex-wrap justify-center items-center gap-2 pt-6">
              <button
                onClick={() =>
                  setState((s) => ({ ...s, page: Math.max(1, s.page - 1) }))
                }
                disabled={state.page === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition shadow-sm
                    ${
                      p === state.page
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                    }`}
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
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                →
              </button>
            </div>
          </>
        )}

        {state.showFavorites && (
          <>
            <div className="flex flex-wrap justify-center items-center gap-2 pt-6">
              <button
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    favoritesPage: Math.max(1, s.favoritesPage - 1),
                  }))
                }
                disabled={state.favoritesPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ←
              </button>

              {Array.from(
                { length: Math.ceil(heroes.length / FAVORITES_LIMIT) },
                (_, i) => i + 1
              )
                .slice(
                  Math.max(0, state.favoritesPage - 3),
                  Math.min(
                    Math.ceil(heroes.length / FAVORITES_LIMIT),
                    state.favoritesPage + 2
                  )
                )
                .map((p) => (
                  <button
                    key={p}
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        favoritesPage: p,
                      }))
                    }
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition shadow-sm
              ${
                p === state.favoritesPage
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
              }`}
                  >
                    {p}
                  </button>
                ))}

              <button
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    favoritesPage: Math.min(
                      Math.ceil(heroes.length / FAVORITES_LIMIT),
                      s.favoritesPage + 1
                    ),
                  }))
                }
                disabled={
                  state.favoritesPage ===
                  Math.ceil(heroes.length / FAVORITES_LIMIT)
                }
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
