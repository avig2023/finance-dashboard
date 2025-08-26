import { NextResponse } from "next/server";

export async function POST() {
  const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } = process.env as Record<string,string | undefined>;

  if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Missing PLAID_CLIENT_ID or PLAID_SECRET", detail: null },
      { status: 500 }
    );
  }

  const base =
    PLAID_ENV === "production"
      ? "https://production.plaid.com"
      : PLAID_ENV === "development"
      ? "https://development.plaid.com"
      : "https://sandbox.plaid.com";

  const payload = {
    client_id: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    client_name: "Finance Dashboard",
    user: { client_user_id: "demo-user" },
    products: ["transactions"],
    country_codes: ["US"],
    language: "en",
  };

  const res = await fetch(`${base}/link/token/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Plaid-Version": "2020-09-14",
    },
    body: JSON.stringify(payload),
  });

  let data: any = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: data?.error_message || res.statusText, detail: data },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, link_token: data.link_token });
}
