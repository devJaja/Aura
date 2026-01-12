import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-indigo-950/30">
      <div className="absolute inset-0 bg-[url('/glow-bg.png')] bg-cover opacity-10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <Logo className="mb-8 h-20 md:h-24" />

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 pb-2">
          AURA Protocol
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-neutral-300 max-w-3xl">
          AI-powered • Stablecoin-native • Autonomous RWA Arbitrage
        </p>

        <p className="mt-4 text-lg text-neutral-400 max-w-2xl">
          Earn transparent, low-risk yields from global market inefficiencies — powered by tokenized assets & DeFi
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-5">
          <Button size="lg" asChild variant="primary">
            <Link href="/dashboard">Enter Vault →</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <a href="https://docs.aura.xyz" target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "USDC / DAI / USDT", label: "Supported Stablecoins" },
            { value: "24/7", label: "Autonomous Execution" },
            { value: "AI-Driven", label: "Opportunity Detection" },
            { value: "Transparent", label: "On-chain Profits" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-2xl md:text-3xl font-bold text-indigo-300">{item.value}</div>
              <div className="mt-1 text-sm text-neutral-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}