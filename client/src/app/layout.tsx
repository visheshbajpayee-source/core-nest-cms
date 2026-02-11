import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
