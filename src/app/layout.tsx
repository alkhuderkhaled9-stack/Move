import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies Discovery Platform",
  description: "Discover and explore movies in Arabic and English",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
