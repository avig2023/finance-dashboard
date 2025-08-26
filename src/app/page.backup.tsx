# from your project root
git init -q  # if you haven't already
git add -A && git commit -m "baseline before summary" || true

# 1) create the patch file
cat > summary.patch <<'PATCH'
*** Begin Patch
*** Update File: src/app/page.tsx
@@
-  const [open, setOpen] = useState<Account | null>(null);
-  const [view, setView] = useState<"cards" | "timeline" | "summary" | "coverage">("cards");
+  const [open, setOpen] = useState<Account | null>(null);
+  // Add "summary" to available views
+  const [view, setView] = useState<"cards" | "timeline" | "summary" | "coverage">("cards");
@@
-          <Tabs value={view} onValueChange={(v: any) => setView(v)}>
-            <TabsList>
-              <TabsTrigger value="cards">Cards</TabsTrigger>
-              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
-              <TabsTrigger value="coverage">Coverage</TabsTrigger>
-            </TabsList>
-          </Tabs>
+          <Tabs value={view} onValueChange={(v: any) => setView(v)}>
+            <TabsList>
+              <TabsTrigger value="cards">Cards</TabsTrigger>
+              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
+              <TabsTrigger value="summary">Summary</TabsTrigger>
+              <TabsTrigger value="coverage">Coverage</TabsTrigger>
+            </TabsList>
+          </Tabs>
@@
   const selectionStats = useMemo(() => {
     let remaining = 0, unmetMin = 0;
     for (const c of selectedCards) {
       const comp = computeCard(c);
       remaining += comp.remaining;
       const minNeeded = Math.max(0, +(c.minimumDue - comp.paid).toFixed(2));
       unmetMin += minNeeded;
     }
     return { remaining: +remaining.toFixed(2), unmetMin: +unmetMin.toFixed(2) };
   }, [selectedCards]);
  // ---------- Summary metrics (tiles) ----------
  const summary = useMemo(() => {
    const banks = filtered.filter(a => a.kind === "bank") as BankAccount[];
    const cards = filtered.filter(a => a.kind === "card") as CardAccount[];

    // Total available cash across bank accounts
    const availableCash = banks.reduce((s,b)=> s + (b.available ?? 0), 0);

    // Upcoming payments in next 30 days = unmet minimum dues
    const upcomingWindowDays = 30;
    const upcomingPayments = cards
      .filter(c => daysUntil(c.dueDate) <= upcomingWindowDays)
      .reduce((s,c) => s + Math.max(0, +(c.minimumDue - computeCard(c).paid).toFixed(2)), 0);

    // Net After Dues = available cash - upcoming minimums
    const netAfterDues = +(availableCash - upcomingPayments).toFixed(2);

    return { availableCash, upcomingPayments, netAfterDues };
  }, [filtered]);

+
+  // ---------- Summary metrics (tiles) ----------
+  const summary = useMemo(() => {
+    const banks = filtered.filter(a => a.kind === "bank") as BankAccount[];
+    const cards = filtered.filter(a => a.kind === "card") as CardAccount[];
+
+    // Total available cash across bank accounts
+    const availableCash = banks.reduce((s,b)=> s + (b.available ?? 0), 0);
+
+    // Upcoming payments in next 30 days = unmet minimum dues
+    const upcomingWindowDays = 30;
+    const upcomingPayments = cards
+      .filter(c => daysUntil(c.dueDate) <= upcomingWindowDays)
+      .reduce((s,c) => s + Math.max(0, +(c.minimumDue - computeCard(c).paid).toFixed(2)), 0);
+
+    // Net After Dues = available cash - upcoming minimums
+    const netAfterDues = +(availableCash - upcomingPayments).toFixed(2);
+    return { availableCash, upcomingPayments, netAfterDues };
+  }, [filtered]);
@@
-{view === "cards" ? (
+{view === "cards" ? (
   <>
     {/* Select All + Export */}
@@
-) : view === "summary" ? (
  <div className="mt-5 grid gap-4">
    {/* Tiles */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-5">
          <div className="text-xs text-slate-500">Available Cash</div>
          <div className="text-2xl font-bold">{fmt(summary.availableCash)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="text-xs text-slate-500">Upcoming Payments (30d, minimum dues)</div>
          <div className="text-2xl font-bold">{fmt(summary.upcomingPayments)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="text-xs text-slate-500">Net After Dues</div>
          <div className="text-2xl font-bold">{fmt(summary.netAfterDues)}</div>
        </CardContent>
      </Card>
    </div>

    {/* Table */}
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="py-3 pl-4">Account</th>
              <th className="py-3">Statement Balance</th>
              <th className="py-3">Remaining This Statement</th>
              <th className="py-3">Due Date</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(filtered.filter(a=>a.kind==="card") as CardAccount[]).map((c) => {
              const spec = statusCopy(c);
              return (
                <tr key={c.id} className="border-b last:border-b-0">
                  <td className="py-3 pl-4">
                    <div className="font-medium">{c.nickname}</div>
                    <div className="text-slate-400 text-xs">{c.institution}</div>
                  </td>
                  <td className="py-3">{fmt(c.statementBalance)}</td>
                  <td className="py-3">{fmt(spec.remaining)}</td>
                  <td className="py-3">
                    {new Date(c.dueDate + "T00:00:00-07:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </td>
                  <td className="py-3 pr-4"><StatusPill tone={spec.tone}>{spec.short}</StatusPill></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
) : (
) : view === "timeline" ? (
+) : view === "timeline" ? (
   <div className="mt-5 grid gap-3">
@@
-  ) : (
+  ) : view === "summary" ? (
+    <div className="mt-5 grid gap-4">
+      {/* Tiles */}
+      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
+        <Card>
+          <CardContent className="p-5">
+            <div className="text-xs text-slate-500">Available Cash</div>
+            <div className="text-2xl font-bold">{fmt(summary.availableCash)}</div>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardContent className="p-5">
+            <div className="text-xs text-slate-500">Upcoming Payments (30d, minimum dues)</div>
+            <div className="text-2xl font-bold">{fmt(summary.upcomingPayments)}</div>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardContent className="p-5">
+            <div className="text-xs text-slate-500">Net After Dues</div>
+            <div className="text-2xl font-bold">{fmt(summary.netAfterDues)}</div>
+          </CardContent>
+        </Card>
+      </div>
+
+      {/* Table */}
+      <Card>
+        <CardContent className="p-0 overflow-x-auto">
+          <table className="w-full text-sm">
+            <thead className="text-left text-slate-500 border-b">
+              <tr>
+                <th className="py-3 pl-4">Account</th>
+                <th className="py-3">Statement Balance</th>
+                <th className="py-3">Remaining This Statement</th>
+                <th className="py-3">Due Date</th>
+                <th className="py-3 pr-4">Status</th>
+              </tr>
+            </thead>
+            <tbody>
+              {(filtered.filter(a=>a.kind==="card") as CardAccount[]).map((c) => {
+                const spec = statusCopy(c);
+                return (
+                  <tr key={c.id} className="border-b last:border-b-0">
+                    <td className="py-3 pl-4">
+                      <div className="font-medium">{c.nickname}</div>
+                      <div className="text-slate-400 text-xs">{c.institution}</div>
+                    </td>
+                    <td className="py-3">{fmt(c.statementBalance)}</td>
+                    <td className="py-3">{fmt(spec.remaining)}</td>
+                    <td className="py-3">
+                      {new Date(c.dueDate + "T00:00:00-07:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
+                    </td>
+                    <td className="py-3 pr-4"><StatusPill tone={spec.tone}>{spec.short}</StatusPill></td>
+                  </tr>
+                );
+              })}
+            </tbody>
+          </table>
+        </CardContent>
+      </Card>
+    </div>
+  ) : (
*** End Patch
PATCH

# 2) apply it
git apply --whitespace=fix summary.patch

# 3) (optional) commit
git add -A && git commit -m "Add Summary tab (tiles + table)"
