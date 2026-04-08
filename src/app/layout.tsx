import "@/styles/globals.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { QueryProvider } from "@/components/providers/query";

export const metadata: Metadata = {
	title: "SuperHeroApi",
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
