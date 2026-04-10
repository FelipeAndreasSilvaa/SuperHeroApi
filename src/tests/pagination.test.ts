import { describe, it, expect } from "vitest";

describe("pagination logic", () => {
  const createHeroes = (total: number) =>
    Array.from({ length: total }, (_, i) => ({ id: i + 1 }));

  it("should return first page correctly", () => {
    const heroes = createHeroes(20);

    const page = 1;
    const limit = 10;

    const result = heroes.slice((page - 1) * limit, page * limit);

    expect(result.length).toBe(10);
    expect(result[0].id).toBe(1);
  });

  it("should return second page correctly", () => {
    const heroes = createHeroes(20);

    const page = 2;
    const limit = 10;

    const result = heroes.slice((page - 1) * limit, page * limit);

    expect(result[0].id).toBe(11);
  });

  it("should handle last page correctly", () => {
    const heroes = createHeroes(15);

    const page = 2;
    const limit = 10;

    const result = heroes.slice((page - 1) * limit, page * limit);

    expect(result.length).toBe(5);
  });

  it("should not exceed total items", () => {
    const heroes = createHeroes(5);

    const page = 1;
    const limit = 10;

    const result = heroes.slice((page - 1) * limit, page * limit);

    expect(result.length).toBe(5);
  });
});