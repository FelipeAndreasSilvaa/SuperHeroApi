"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { listHeroAction, type Pagination } from "@/actions/list-hero";

export default function RootPage() {
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [search, setSearch] = useState<string | null>(null);

	const query = useQuery({
		queryKey: ["heroes", pagination, search],
		queryFn: () =>
			listHeroAction({
				options: {
					pagination: pagination,
					search: search,
				},
			}),
		initialData: [],
	});

	const isLoading = query.isLoading;

	if (isLoading) console.log("loading...");

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
				</header>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{query.data.map((hero) => (
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
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
