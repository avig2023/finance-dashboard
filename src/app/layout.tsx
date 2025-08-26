import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "Finance Dashboard",
  description: "Personal cash flow & cards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-slate-50">
          <AppHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
