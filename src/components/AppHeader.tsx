'use client';

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function AppHeader() {
  const { user } = useUser();

  return (
    <div className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3 gap-3">
        <Link href="/" className="font-semibold">Finance Dashboard</Link>

        <div className="flex items-center gap-3">
          <SignedIn>
            <div className="text-sm text-slate-600">
              {user?.firstName ? `Hi, ${user.firstName}` : user?.username || user?.primaryEmailAddress?.emailAddress || "Signed in"}
            </div>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>

          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
