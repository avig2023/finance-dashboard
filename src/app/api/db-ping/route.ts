import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  // Simple round-trip to your database
  const rows = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`;
  return NextResponse.json({ ok: true, now: rows?.[0]?.now ?? null });
}
