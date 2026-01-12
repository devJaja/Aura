"use client";

import { ConnectButton } from "@/components/ui/ConnectButton";
import { VaultStats } from "@/components/VaultDashboard/VaultStats";
import { DepositWithdrawTabs } from "@/components/VaultDashboard/DepositWithdrawTabs";
import { StrategyOverview } from "@/components/VaultDashboard/StrategyOverview";
import { Logo } from "@/components/ui/Logo";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-10" />
            <span className="font-semibold text-xl tracking-tight">AURA Vault</span>
          </div>

          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Quick Stats */}
          <VaultStats />

          {/* Deposit / Withdraw */}
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6">Your Position</h2>
            <DepositWithdrawTabs />
          </section>

          {/* Strategies Overview */}
          <StrategyOverview />

          {/* Small profit history chart can be added here later */}
        </div>
      </main>

      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-600 text-sm">
        AURA Protocol © {new Date().getFullYear()} • Fully on-chain • Audits in progress
      </footer>
    </div>
  );
}