import { NextResponse } from "next/server";

export async function GET() {
  const accounts = [
    { id: "chk_wf", type: "bank", institution: "Wells Fargo", nickname: "WF Checking", last4: "1204", currentBalance: 18250.0, available: 18010.0 },
    { id: "cc_amex_p", type: "card", institution: "American Express", nickname: "AmEx Gold", last4: "3012", statementBalance: 2450.73, minimumDue: 75.0, dueDate: "2025-08-30" },
    { id: "cc_chase_p", type: "card", institution: "Chase", nickname: "Sapphire", last4: "7719", statementBalance: 3810.22, minimumDue: 114.0, dueDate: "2025-09-06" },
  ];
  return NextResponse.json({ ok: true, accounts });
}
