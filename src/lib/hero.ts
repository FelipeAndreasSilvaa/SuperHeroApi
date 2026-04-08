import fs from "node:fs/promises";
import path from "node:path";
import { type HeroSchema, heroSchema } from "@/schemas/hero";

const heroesJsonPath = path.join(process.cwd(), "src", "assets", "all.json");

export async function getAllHeroes(): Promise<HeroSchema[]> {
	const heroesJson = await fs.readFile(heroesJsonPath, "utf8");
	return heroSchema.array().parse(JSON.parse(heroesJson));
}

export async function getHeroBySlug(slug: string): Promise<HeroSchema | null> {
	const heroes = await getAllHeroes();
	const hero = heroes.find((hero) => hero.slug === slug);
	return hero || null;
}
