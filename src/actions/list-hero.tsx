"use server";

import { getAllHeroes } from "@/lib/hero";
import type { HeroSchema } from "@/schemas/hero";

export interface Pagination {
	page?: number;
	limit?: number;
}

interface Options {
	pagination?: Pagination | null;
	search?: string | null;
}

interface Params {
	options?: Options;
}

export async function listHeroAction({
	options,
}: Params): Promise<HeroSchema[]> {
	const allHeroes = await getAllHeroes();
	const searchTerm = normalizeSearch(options?.search ?? "");

	const filteredHeroes = allHeroes
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((hero) => {
			if (!searchTerm) return true;

			const searchableFields = [
				hero.name,
				hero.biography.fullName,
				hero.biography.alterEgos,
				...hero.biography.aliases,
			]
				.map(normalizeValue)
				.filter(Boolean);

			return searchableFields.some((field) => field.includes(searchTerm));
		});

	// if pagination is provided, slice the heroes
	if (options?.pagination) {
		return filteredHeroes.slice(
			(options.pagination.page ?? 1 - 1) * (options.pagination.limit ?? 10),
			(options.pagination.page ?? 1) * (options.pagination.limit ?? 10),
		);
	}

	return filteredHeroes;
}

function normalizeSearch(value?: string): string {
	if (!value) return "";
	return normalizeValue(value.trim());
}

function normalizeValue(value: string): string {
	return value
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();
}
