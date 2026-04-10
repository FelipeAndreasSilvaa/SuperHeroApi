import { useEffect, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const update = () => {
      const data = JSON.parse(localStorage.getItem("favorites") ?? "[]");
      setFavorites(data);
    };

    update();
    window.addEventListener("favoritesUpdated", update);

    return () => window.removeEventListener("favoritesUpdated", update);
  }, []);

  return { favorites };
}