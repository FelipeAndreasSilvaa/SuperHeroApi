export default function RootPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-12 text-slate-100">
			<section className="w-full max-w-2xl rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm">
				<span className="mb-4 inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-300">
					SuperHeroApi
				</span>
				<h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
					Hello World
				</h1>
				<p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
					Esta é a home do projeto SuperHeroApi.
				</p>
			</section>
		</main>
	);
}
