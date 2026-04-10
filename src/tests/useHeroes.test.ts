import { describe, it, expect } from "vitest";

describe("sorting heroes", () => {
  it("sorts by name asc", () => {
    const heroes = [
      { name: "Superman", id: 2 },
      { name: "Batman", id: 1 },
    ];

    const sorted = [...heroes].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    expect(sorted[0].name).toBe("Batman");
  });

  it("sorts by id desc", () => {
    const heroes = [
      { id: 1 },
      { id: 3 },
      { id: 2 },
    ];

    const sorted = [...heroes].sort((a, b) => b.id - a.id);

    expect(sorted[0].id).toBe(3);
  });
});