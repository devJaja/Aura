import { ArrowUpRight, Banknote, BrainCircuit, Scale } from "lucide-react";

const stats = [
  {
    name: "Total Value Locked (TVL)",
    value: "$1,234,567",
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
    value: "RWA Arbitrage #3",
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

export const VaultStats = () => {
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
