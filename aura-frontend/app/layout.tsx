import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Web3Provider } from "./Web3Provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AURA Protocol • Autonomous RWA Arbitrage",
  description: "Earn stable, transparent yields from AI-powered global arbitrage",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-neutral-950 text-neutral-100 antialiased`}
      >
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
