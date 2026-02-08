import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "ENS Profile dApp",
  description: "Decentralized profile management with ENS on Sepolia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
