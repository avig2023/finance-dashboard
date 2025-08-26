'use client';
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";

export default function SetupPage() {
  const { user } = useUser();
  const [linkToken, setLinkToken] = useState<string | null>(null);

  async function createLinkToken() {
    const r = await fetch("/api/plaid/link", { method: "POST" });
    if (!r.ok) {
      alert("Failed to create link token");
      return;
    }
    const { link_token } = await r.json();
    setLinkToken(link_token);
  }

  const { open, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess: async (public_token, metadata) => {
      try {
        const r = await fetch("/api/plaid/exchange", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ public_token }),
        });
        if (!r.ok) throw new Error("Exchange failed");
        alert("Accounts linked! You can now load your dashboard.");
        // TODO: redirect to dashboard later
        // window.location.href = "/";
      } catch (e) {
        alert("Exchange failed");
        console.error(e);
      }
    },
  });

  useEffect(() => {
    createLinkToken();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Welcome {user?.firstName || ""}!</h1>
      <p className="text-slate-600">Let’s connect your bank and credit card accounts.</p>

      {!linkToken ? (
        <Button onClick={createLinkToken}>Generate Plaid Link Token</Button>
      ) : (
        <Button onClick={() => open()} disabled={!ready}>Connect with Plaid</Button>
      )}
    </div>
  );
}
