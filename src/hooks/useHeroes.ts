import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { listHeroAction } from "@/actions/list-hero";

type SortKey = "name" | "alignment" | "publisher";

export function useHeroes(state: any, favorites: number[]) {
  const query = useQuery({
    queryKey: ["heroes", state],
    queryFn: () =>
      listHeroAction({
        options: {
          pagination: state.showFavorites
            ? undefined
            : { page: state.page, limit: state.limit },
          search: state.search,
        },
      }),
    placeholderData: (prev) => prev,
  });

  const heroes = useMemo(() => {
    if (!query.data) return [];

    return query.data.data
      .filter((h) =>
        state.showFavorites ? favorites.includes(h.id) : true
      )
      .filter((h) =>
        state.publisher ? h.biography.publisher === state.publisher : true
      )
      .sort((a, b) => {
        const map = {
          name: a.name.localeCompare(b.name),
          alignment: a.biography.alignment.localeCompare(b.biography.alignment),
          publisher: (a.biography.publisher ?? "").localeCompare(
            b.biography.publisher ?? ""
          ),
          id: a.id - b.id,
        };
      
        const result = map[state.sort];
      
        return state.direction === "asc" ? result : -result;
      })
  }, [query.data, state, favorites]);

  return {
    ...query,
    heroes,
  };
}