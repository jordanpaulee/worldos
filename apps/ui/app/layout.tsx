import type { Metadata } from "next";
import "./globals.css";

import { AppShell } from "../components/app-shell";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "Project Chrona",
  description: "AI-native macro intelligence terminal."
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
