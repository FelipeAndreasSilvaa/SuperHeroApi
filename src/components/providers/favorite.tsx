"use client";

import { useState, useEffect } from "react";

interface Props {
  heroId: number;
  heroName: string;
}

export function FavoriteButton({ heroId }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") ?? "[]") as number[];
    setIsFavorite(favorites.includes(heroId));
  }, [heroId]);

  function toggle() {
    const favorites = JSON.parse(localStorage.getItem("favorites") ?? "[]") as number[];

    let updated: number[];

    if (favorites.includes(heroId)) {
      updated = favorites.filter((id) => id !== heroId);
      setIsFavorite(false);
    } else {
      updated = [...favorites, heroId];
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updated));


    window.dispatchEvent(new Event("favoritesUpdated"));
  }

  return (
    <button
      onClick={toggle}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition
        ${
          isFavorite
            ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20"
            : "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-yellow-400/30 hover:text-yellow-300"
        }`}
    >
      <span className="text-lg">{isFavorite ? "★" : "☆"}</span>
      {isFavorite ? "Favorited" : "Add to favorites"}
    </button>
  );
}