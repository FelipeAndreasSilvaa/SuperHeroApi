import "@/styles/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "SuperHeroApi",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html lang="pt-BR">
			<body>{children}</body>
		</html>
	);
}
