import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./provider/QueryProvider";

export const metadata: Metadata = {
  title: "CMS Client",
  description: "Core Nest CMS - Client",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
