import { z } from "zod";

export const heroSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	powerstats: z.object({
		intelligence: z.number(),
		strength: z.number(),
		speed: z.number(),
		durability: z.number(),
		power: z.number(),
		combat: z.number(),
	}),
	appearance: z.object({
		gender: z.string(),
		race: z.string().nullable(),
		height: z.tuple([z.string(), z.string()]),
		weight: z.tuple([z.string(), z.string()]),
		eyeColor: z.string(),
		hairColor: z.string(),
	}),
	biography: z.object({
		fullName: z.string(),
		alterEgos: z.string(),
		aliases: z.array(z.string()),
		placeOfBirth: z.string(),
		firstAppearance: z.string(),
		publisher: z.string().nullable(),
		alignment: z.string(),
	}),
	work: z.object({ occupation: z.string(), base: z.string() }),
	connections: z.object({
		groupAffiliation: z.string(),
		relatives: z.string(),
	}),
	images: z.object({
		xs: z.string(),
		sm: z.string(),
		md: z.string(),
		lg: z.string(),
	}),
});

export type HeroSchema = z.infer<typeof heroSchema>;
