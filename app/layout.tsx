import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARC Raiders IQ",
  description: "ARC Raiders IQ reference and planning tools"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <header className="mb-10 flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">ARC Raiders IQ</h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
