import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const publicToken = String(body?.publicToken ?? "");

  // Mock: normally you'd call Plaid exchange here and store access_token securely.
  return NextResponse.json({ ok: true, itemId: "mock-item-id", received: publicToken });
}
