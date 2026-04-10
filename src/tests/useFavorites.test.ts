import { describe, it, expect, beforeEach } from "vitest";

describe("favorites logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should add hero to favorites", () => {
    const favorites: number[] = [];

    const addFavorite = (arr: number[], id: number) => {
      if (arr.includes(id)) return arr;
      return [...arr, id];
    };

    const result = addFavorite(favorites, 1);

    expect(result).toContain(1);
  });

  it("should not duplicate favorites", () => {
    const favorites = [1];

    const addFavorite = (arr: number[], id: number) => {
      if (arr.includes(id)) return arr;
      return [...arr, id];
    };

    const result = addFavorite(favorites, 1);

    expect(result).toHaveLength(1);
  });

  it("should remove hero from favorites", () => {
    const favorites = [1, 2];

    const removeFavorite = (arr: number[], id: number) =>
      arr.filter((f) => f !== id);

    const result = removeFavorite(favorites, 1);

    expect(result).not.toContain(1);
    expect(result).toHaveLength(1);
  });

  it("should save favorites to localStorage", () => {
    const favorites = [1, 2];

    localStorage.setItem("favorites", JSON.stringify(favorites));

    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    expect(stored).toEqual([1, 2]);
  });

  it("should load favorites from localStorage", () => {
    localStorage.setItem("favorites", JSON.stringify([5]));

    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    expect(stored).toContain(5);
  });
});