"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Tab = "deposit" | "withdraw";

export const DepositWithdrawTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>("deposit");

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-4 mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`px-4 py-2 rounded-lg text-lg font-semibold transition-colors ${
            activeTab === "deposit"
              ? "bg-indigo-600 text-white"
              : "text-neutral-400 hover:bg-neutral-800"
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`px-4 py-2 rounded-lg text-lg font-semibold transition-colors ${
            activeTab === "withdraw"
              ? "bg-indigo-600 text-white"
              : "text-neutral-400 hover:bg-neutral-800"
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "deposit" && <DepositTab />}
        {activeTab === "withdraw" && <WithdrawTab />}
      </div>
    </div>
  );
};

const DepositTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-semibold">Deposit Stablecoins</h3>
        <div className="text-right">
          <p className="text-sm text-neutral-500">Your Balance</p>
          <p className="font-mono text-lg">$5,000.00</p>
        </div>
      </div>

      <div className="relative">
        <input
          type="number"
          placeholder="0.00"
          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-4 pr-20 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-neutral-500">
          USDC
        </span>
      </div>
      
      <p className="text-sm text-neutral-500">
        You will receive vault tokens (aToken) representing your share of the vault.
      </p>

      <Button size="lg" className="w-full">
        Approve & Deposit
      </Button>
    </div>
  );
};

const WithdrawTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-semibold">Withdraw Stablecoins</h3>
        <div className="text-right">
          <p className="text-sm text-neutral-500">Your Vault Position</p>
          <p className="font-mono text-lg">$1,250.00</p>
        </div>
      </div>

       <div className="relative">
        <input
          type="number"
          placeholder="0.00"
          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-4 pr-20 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-neutral-500">
          aToken
        </span>
      </div>
      
      <p className="text-sm text-neutral-500">
        You will receive USDC back in your wallet. Withdrawals may be subject to a 0.1% fee.
      </p>

      <Button size="lg" className="w-full" variant="outline">
        Withdraw
      </Button>
    </div>
  );
};
