"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { listHeroAction } from "@/actions/list-hero";
import { useEffect } from "react";
import { HeroSchema } from "@/schemas/hero";

type SortKey = "name" | "alignment" | "publisher";

export default function RootPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState<string>("");

  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const [publisherFilter, setPublisherFilter] = useState<string>("");

  const [compare, setCompare] = useState<HeroSchema[]>([]);

  const query = useQuery({
    queryKey: ["heroes", page, limit, search, showFavorites],
    queryFn: () =>
      listHeroAction({
        options: {
          pagination: showFavorites ? undefined : { page, limit },
          search, 
        },
      }),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const updateFavorites = () => {
      const stored = JSON.parse(localStorage.getItem("favorites") ?? "[]") as number[];
      setFavoriteIds(stored);
    };
  
    updateFavorites();
  
    window.addEventListener("favoritesUpdated", updateFavorites);
  
    return () => {
      window.removeEventListener("favoritesUpdated", updateFavorites);
    };
  }, []);

  if (query.isLoading && !query.data) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!query.data) {
    return <p className="text-center mt-10">No data</p>;
  }

  const data = query.data;

  const sortedData = [...data.data].sort((a, b) => {
    if (sortKey === "name") return a.name.localeCompare(b.name);
    if (sortKey === "alignment")
      return a.biography.alignment.localeCompare(b.biography.alignment);
    if (sortKey === "publisher")
      return (a.biography.publisher ?? "").localeCompare(
        b.biography.publisher ?? ""
      );
    return 0;
  });

  const displayData = sortedData
    .filter((hero) =>
      showFavorites ? favoriteIds.includes(hero.id) : true
    )
    .filter((hero) => {
      if (!publisherFilter) return true;
      return hero.biography.publisher === publisherFilter;
    });


    const compareHeroes = compare;

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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <button
              onClick={() => {
                setShowFavorites((prev) => !prev);
                setPage(1);
                setPublisherFilter("");
              }}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition whitespace-nowrap
                ${
                  showFavorites
                    ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-yellow-400/30 hover:text-yellow-300"
                }`}
            >
              {showFavorites ? "★" : "☆"} Favorites
              {favoriteIds.length > 0 && (
                <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs text-yellow-300">
                  {favoriteIds.length}
                </span>
              )}
            </button>

            <select
              className="rounded-lg bg-slate-800 p-2 text-slate-300"
              value={publisherFilter}
              onChange={(e) => {
                setPage(1);
                setPublisherFilter(e.target.value);
              }}
            >
              <option value="">All Publishers</option>
              <option value="Marvel Comics">Marvel</option>
              <option value="DC Comics">DC</option>
            </select>

            <select
              className="rounded-lg bg-slate-800 p-2 text-slate-300"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="name">Name</option>
              <option value="alignment">Alignment</option>
              <option value="publisher">Publisher</option>
            </select>

            <select
              className="rounded-lg bg-slate-800 p-2"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </header>

        {compareHeroes.length === 2 && (
          <div className="bg-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-bold mb-4">Comparação de Heróis</h2>

            <div className="grid grid-cols-2 gap-4">
              {compareHeroes.map((hero) => (
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

            <button
              onClick={() => setCompare([])}
              className="mt-3 text-red-400"
            >
              Limpar comparação
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayData.map((hero) => (
            <Link
              key={hero.id}
              href={`/hero/${hero.slug}`}
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
                  setCompare((prev) => {
                    if (prev.some((h) => h.id === hero.id)) {
                      return prev.filter((h) => h.id !== hero.id);
                    }
                    if (prev.length >= 2) return prev;
                    return [...prev, hero];
                  });
                }}
                className={`mt-3 w-full rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200
                ${
                   compare.some((h) => h.id === hero.id) 
                    ? "border-red-400/40 bg-red-400/10 text-red-300 hover:bg-red-400/20"
                    : "border-indigo-400/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400"
                }`}
              >
                { compare.some((h) => h.id === hero.id) 
                  ? "Remover da comparação"
                  : "Comparar"}
              </button>
            </Link>
          ))}
        </div>

        {!showFavorites && (
          <>
            <p className="text-center text-sm text-slate-400 mt-4">
              Mostrando {(page - 1) * limit + 1}–
              {Math.min(page * limit, data.total)} de {data.total} heróis
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ←
              </button>

              {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, page - 3),
                  Math.min(data.totalPages, page + 2)
                )
                .map((p) => (
                  <button key={p} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}

              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
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