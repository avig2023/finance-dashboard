import { NextResponse } from "next/server";

export async function GET() {
  const txns = [
    { id: "t1", accountId: "chk_wf", date: "2025-08-18", amount: -120.55, name: "Safeway" },
    { id: "t2", accountId: "chk_wf", date: "2025-08-17", amount: -64.20, name: "Shell" },
  ];
  return NextResponse.json({ ok: true, transactions: txns });
}
