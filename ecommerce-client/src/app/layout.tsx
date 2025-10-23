"use client";

import Footer from "@/components/Footer";
import "./globals.css";
import Header from "@/components/Header";
import SearchModel from "@/components/Products/SearchModel";
import { usePathname } from "next/navigation";
import { SearchProvider } from "@/hooks/SearchProivder";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html lang="en">
      <body>
        <SearchProvider>
          <SearchModel />
          {!isDashboard && <Header />}
          {!isDashboard && <div className="h-14"></div>}
          {children}
          {!isDashboard && <Footer />}
        </SearchProvider>
      </body>
    </html>
  );
}
