import { NextResponse } from "next/server";
import { getAllHeroes } from "@/lib/hero";

export async function GET() {
	const heroes = await getAllHeroes();
	return NextResponse.json(heroes);
}
