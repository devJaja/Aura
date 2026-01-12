import { BrainCircuit } from "lucide-react";

export const StrategyOverview = () => {
  return (
    <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 rounded-lg p-3">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Strategy Overview</h2>
          <p className="text-neutral-400">How the vault generates yield.</p>
        </div>
      </div>

      <div className="space-y-6 text-neutral-300">
        <p>
          The AURA vault executes an automated, AI-driven arbitrage strategy focused on Real World Assets (RWAs).
          It primarily arbitrages inefficiencies between the primary and secondary markets of tokenized,
          short-duration US Treasury Bills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-indigo-300 mb-2">1. Capital Deployment</h4>
            <p className="text-sm">
              Vault deposits are used to mint newly issued, tokenized T-Bills from trusted partners like Ondo Finance or Backed Finance.
            </p>
          </div>
          <div className="bg-neutral-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-indigo-300 mb-2">2. Arbitrage Execution</h4>
            <p className="text-sm">
              Our AI model monitors secondary markets (e.g., Curve, Uniswap) for price discrepancies. When tokenized T-Bills trade at a premium, the vault sells for a profit.
            </p>
          </div>
          <div className="bg-neutral-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-indigo-300 mb-2">3. Compounding Yield</h4>
            <p className="text-sm">
              Profits are reinvested, compounding the vault&apos;s capital base. The strategy remains delta-neutral and is hedged against interest rate risk.
            </p>
          </div>
        </div>
        
        <div className="text-sm text-neutral-500 pt-4 border-t border-neutral-800">
          <strong>Risk Profile:</strong> Low. The primary risk is smart contract risk. The underlying assets are backed by the US Government. The AI model is designed for capital preservation.
        </div>
      </div>
    </section>
  );
};
