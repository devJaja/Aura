"use client";

import { ArrowUpRight, Banknote, BrainCircuit, Scale } from "lucide-react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { AURA_VAULT_ABI, AURA_VAULT_ADDRESS } from "@/lib/contracts";
import { mainnet } from "wagmi/chains";

export const VaultStats = () => {
  const { data: totalAssetsData } = useReadContract({
    abi: AURA_VAULT_ABI,
    address: AURA_VAULT_ADDRESS,
    functionName: "totalAssets",
    chainId: mainnet.id,
  });

  const { data: vaultNameData } = useReadContract({
    abi: AURA_VAULT_ABI,
    address: AURA_VAULT_ADDRESS,
    functionName: "name",
    chainId: mainnet.id,
  });

  const formattedTotalAssets = totalAssetsData
    ? `$${Number(formatUnits(totalAssetsData, 6)).toLocaleString()}` // Assuming 6 decimals for USDC/DAI
    : "$0";

  const stats = [
    {
      name: "Total Value Locked (TVL)",
      value: formattedTotalAssets,
      change: "+4.2% MoM",
      icon: Banknote,
    },
    {
      name: "Vault APY",
      value: "12.8%",
      change: "Realised",
      icon: ArrowUpRight,
    },
    {
      name: "Current Vault Strategy",
      value: vaultNameData || "RWA Arbitrage #3",
      change: "Stable",
      icon: BrainCircuit,
    },
    {
      name: "Total Profit Generated",
      value: "$87,654",
      change: "Since Inception",
      icon: Scale,
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 flex items-start"
          >
            <div className="bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 rounded-lg p-3">
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-400">{stat.name}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-neutral-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
