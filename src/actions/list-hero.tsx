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

interface ListHeroResponse {
	data: HeroSchema[];
	total: number;
	page: number;
	totalPages: number;
}

export async function listHeroAction({
	options,
}: Params): Promise<ListHeroResponse> {
	const allHeroes = await getAllHeroes();

	const searchTerm = normalizeSearch(options?.search ?? "");

	const filteredHeroes = allHeroes
    .filter((hero) => {
        if (!searchTerm) return true;

        return normalizeValue(hero.name)
            .split(" ")
            .some((word) => word.startsWith(searchTerm));
    })
    .sort((a, b) => a.name.localeCompare(b.name));

	if (!options?.pagination) {
		return {
			data: filteredHeroes,
			total: filteredHeroes.length,
			page: 1,
			totalPages: 1,
		};
	}

	const page = options.pagination.page ?? 1;
	const limit = options.pagination.limit ?? 10;

	const start = (page - 1) * limit;
	const end = page * limit;

	const paginatedHeroes = filteredHeroes.slice(start, end);

	return {
		data: paginatedHeroes,
		total: filteredHeroes.length,
		page,
		totalPages: Math.ceil(filteredHeroes.length / limit),
	};
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