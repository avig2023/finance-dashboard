// src/app/api/plaid/link/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,      // ✅ enum
  CountryCode,   // ✅ enum
} from 'plaid';

function getPlaidClient() {
  const env = (process.env.PLAID_ENV ?? 'sandbox').toLowerCase();
  const basePath =
    env === 'production' ? PlaidEnvironments.production :
    env === 'development' ? PlaidEnvironments.development :
    PlaidEnvironments.sandbox;

  const config = new Configuration({
    basePath,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID ?? '',
        'PLAID-SECRET': process.env.PLAID_SECRET ?? '',
      },
    },
  });

  return new PlaidApi(config);
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const plaid = getPlaidClient();

    const resp = await plaid.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Finance Dashboard',
      products: [Products.Transactions],     // ✅ enum, not 'transactions'
      country_codes: [CountryCode.Us],       // ✅ enum, not 'US'
      language: 'en',
      // redirect_uri: 'https://YOUR_URL/callback' // only if you use OAuth
    });

    return NextResponse.json({ link_token: resp.data.link_token });
  } catch (err: any) {
    console.error('Plaid link token error:', err?.response?.data ?? err);
    return NextResponse.json(
      { error: 'link_token_failed', detail: err?.response?.data ?? String(err) },
      { status: 500 }
    );
  }
}
