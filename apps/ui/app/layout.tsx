import type { Metadata } from "next";
import "./globals.css";

import { AppShell } from "../components/app-shell";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "WorldOS",
  description: "Financial-Aware Public World Intelligence Graph"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
