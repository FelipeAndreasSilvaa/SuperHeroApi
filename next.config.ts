import type { NextConfig } from "next";

module.exports = {
	images: {
		remotePatterns: [{ hostname: "cdn.jsdelivr.net" }],
	},
} satisfies NextConfig;
