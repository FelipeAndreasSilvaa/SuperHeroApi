import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeroBySlug } from "@/lib/hero";
import type { HeroSchema } from "@/schemas/hero";

interface Params {
	slug: string;
}

interface Props {
	params: Promise<Params>;
}

export default async function RootPage({ params }: Props) {
	const { slug } = await params;

	const hero = await getHeroBySlug(slug);
	if (!hero) return notFound();

	const stats = [
		{
			label: "Intelligence",
			value: hero.powerstats.intelligence,
			color: "bg-cyan-400",
		},
		{
			label: "Strength",
			value: hero.powerstats.strength,
			color: "bg-rose-400",
		},
		{
			label: "Speed",
			value: hero.powerstats.speed,
			color: "bg-emerald-400",
		},
		{
			label: "Durability",
			value: hero.powerstats.durability,
			color: "bg-orange-400",
		},
		{ label: "Power", value: hero.powerstats.power, color: "bg-indigo-400" },
		{
			label: "Combat",
			value: hero.powerstats.combat,
			color: "bg-purple-400",
		},
	] as const;
	const averagePower = Math.round(
		stats.reduce((total, stat) => total + stat.value, 0) / stats.length,
	);
	const maxStat = stats.reduce((acc, cur) =>
		cur.value > acc.value ? cur : acc,
	);
	const minStat = stats.reduce((acc, cur) =>
		cur.value < acc.value ? cur : acc,
	);

	return (
		<main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-10">
			<section className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
				<Link
					href="/"
					className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-indigo-300/40 hover:text-white"
				>
					&larr; Back to heroes
				</Link>
				<header className="overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950 shadow-2xl">
					<div className="grid gap-5 p-5 sm:grid-cols-[190px_1fr] sm:p-7">
						<Image
							src={hero.images.lg}
							alt={`Image of ${hero.name}`}
							width={190}
							height={190}
							className="mx-auto h-44 w-44 rounded-2xl border border-slate-700 object-cover shadow-lg sm:mx-0 sm:h-[190px] sm:w-[190px]"
						/>
						<div className="space-y-4">
							<span className="inline-flex rounded-full border border-indigo-300/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200">
								Hero Profile
							</span>
							<div>
								<h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
									{hero.name}
								</h1>
								<p className="mt-2 text-sm text-slate-300 sm:text-base">
									{getFullName(hero)} | {hero.biography.publisher ?? "Unknown"}{" "}
									| {hero.biography.alignment}
								</p>
							</div>
							<div className="flex flex-wrap gap-2 text-xs sm:text-sm">
								<Badge label={`Gender: ${hero.appearance.gender}`} />
								<Badge label={`Race: ${hero.appearance.race ?? "Unknown"}`} />
								<Badge label={`Eyes: ${hero.appearance.eyeColor}`} />
								<Badge label={`Hair: ${hero.appearance.hairColor}`} />
							</div>
						</div>
					</div>
				</header>

				<section className="grid gap-4 md:grid-cols-3">
					<MetricCard title="Average Rating" value={`${averagePower}/100`} />
					<MetricCard
						title="Top Skill"
						value={`${maxStat.label} (${maxStat.value})`}
					/>
					<MetricCard
						title="Needs Improvement"
						value={`${minStat.label} (${minStat.value})`}
					/>
				</section>

				<div className="grid gap-4 md:grid-cols-3">
					<InfoCard
						title="Identity"
						rows={[
							{ label: "Full name", value: getFullName(hero) },
							{ label: "Alter egos", value: hero.biography.alterEgos },
							{ label: "Alignment", value: hero.biography.alignment },
							{
								label: "Publisher",
								value: hero.biography.publisher ?? "Unknown",
							},
						]}
					/>
					<InfoCard
						title="History"
						rows={[
							{
								label: "First appearance",
								value: hero.biography.firstAppearance,
							},
							{ label: "Place of birth", value: hero.biography.placeOfBirth },
							{ label: "Occupation", value: hero.work.occupation },
							{ label: "Base", value: hero.work.base },
						]}
					/>
					<InfoCard
						title="Appearance & Network"
						rows={[
							{ label: "Height", value: hero.appearance.height[1] },
							{ label: "Weight", value: hero.appearance.weight[1] },
							{
								label: "Affiliation",
								value: hero.connections.groupAffiliation,
							},
							{ label: "Relatives", value: hero.connections.relatives },
						]}
					/>

					<article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl md:col-span-3">
						<h2 className="text-xl font-semibold text-white">
							Power Breakdown
						</h2>
						<p className="mt-1 text-sm text-slate-400">
							Each bar represents one hero capability from 0 to 100.
						</p>
						<div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
							{stats.map((stat) => (
								<div
									key={stat.label}
									className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3"
								>
									<div className="flex items-center justify-between text-sm text-slate-200">
										<span>{stat.label}</span>
										<span className="font-semibold">{stat.value}</span>
									</div>
									<div className="mt-2 h-2.5 rounded-full bg-slate-800">
										<div
											className={`h-full rounded-full ${stat.color}`}
											style={{ width: `${clamp(stat.value)}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</article>
				</div>
			</section>
		</main>
	);
}

function Badge({ label }: { label: string }) {
	return (
		<span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-slate-200">
			{label}
		</span>
	);
}

function MetricCard({ title, value }: { title: string; value: string }) {
	return (
		<article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
			<p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
			<p className="mt-2 text-lg font-semibold text-white">{value}</p>
		</article>
	);
}

function InfoCard({
	title,
	rows,
}: {
	title: string;
	rows: Array<{ label: string; value: string }>;
}) {
	return (
		<article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
			<h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
			<dl className="space-y-3">
				{rows.map((row) => (
					<div
						key={`${title}-${row.label}`}
						className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
					>
						<dt className="text-xs uppercase tracking-wide text-slate-400">
							{row.label}
						</dt>
						<dd className="mt-1 text-sm text-slate-200">{row.value}</dd>
					</div>
				))}
			</dl>
		</article>
	);
}

function getFullName(hero: HeroSchema): string {
	return hero.biography.fullName.trim() || "Unknown secret identity";
}

function clamp(value: number): number {
	return Math.max(0, Math.min(value, 100));
}
