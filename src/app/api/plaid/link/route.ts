// src/app/api/plaid/link/route.ts
export const runtime = 'nodejs'; // ✅ Plaid SDK needs Node, not Edge

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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
    // (Optional) require auth if you want link tokens tied to a user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const plaid = getPlaidClient();

    // Create link token
    const resp = await plaid.linkTokenCreate({
      user: { client_user_id: userId },     // must be a non-empty string
      client_name: 'Finance Dashboard',
      products: ['transactions'],           // adjust to what your app uses
      country_codes: ['US'],
      language: 'en',
      // redirect_uri: 'https://your-app-url/callback' // only if using OAuth
    });

    return NextResponse.json({ link_token: resp.data.link_token });
  } catch (err: any) {
    // ✅ Make errors visible in Vercel Runtime Logs
    console.error('Plaid link token error:', err?.response?.data ?? err);
    return NextResponse.json(
      { error: 'link_token_failed', detail: err?.response?.data ?? String(err) },
      { status: 500 }
    );
  }
}
