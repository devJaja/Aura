"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatUnits, parseUnits, Address } from "viem";
import { AURA_VAULT_ABI, AURA_VAULT_ADDRESS, ERC20_ABI } from "@/lib/contracts";
import { mainnet } from "wagmi/chains";

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
  const { address } = useAccount();
  const [depositAmount, setDepositAmount] = useState<string>("");

  // Get underlying asset address from AuraVault
  const { data: assetAddress } = useReadContract({
    abi: AURA_VAULT_ABI,
    address: AURA_VAULT_ADDRESS,
    functionName: "asset",
    chainId: mainnet.id,
  });

  // Get asset details (decimals, symbol)
  const { data: assetDecimals } = useReadContract({
    abi: ERC20_ABI,
    address: assetAddress as Address,
    functionName: "decimals",
    chainId: mainnet.id,
    query: {
      enabled: !!assetAddress,
    },
  });

  const { data: assetSymbol } = useReadContract({
    abi: ERC20_ABI,
    address: assetAddress as Address,
    functionName: "symbol",
    chainId: mainnet.id,
    query: {
      enabled: !!assetAddress,
    },
  });

  // Get user's stablecoin balance
  const { data: userAssetBalance } = useReadContract({
    abi: ERC20_ABI,
    address: assetAddress as Address,
    functionName: "balanceOf",
    args: [address as Address],
    chainId: mainnet.id,
    query: {
      enabled: !!assetAddress && !!address,
    },
  });

  // Get vault's allowance for user's stablecoin
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    address: assetAddress as Address,
    functionName: "allowance",
    args: [address as Address, AURA_VAULT_ADDRESS],
    chainId: mainnet.id,
    query: {
      enabled: !!assetAddress && !!address,
    },
  });

  const parsedDepositAmount =
    depositAmount && typeof assetDecimals === "number"
      ? parseUnits(depositAmount as `${number}`, assetDecimals)
      : 0n;

  const needsApproval = allowance !== undefined && parsedDepositAmount > (allowance as bigint);

  // Approve transaction
  const {
    data: approveHash,
    writeContract: approveWrite,
    isPending: isApprovePending,
    isError: isApproveError,
    error: approveError,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // Deposit transaction
  const {
    data: depositHash,
    writeContract: depositWrite,
    isPending: isDepositPending,
    isError: isDepositError,
    error: depositError,
  } = useWriteContract();

  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });

  const handleApprove = () => {
    if (!assetAddress || !parsedDepositAmount) return;
    approveWrite({
      abi: ERC20_ABI,
      address: assetAddress as Address,
      functionName: "approve",
      args: [AURA_VAULT_ADDRESS, parsedDepositAmount],
      chainId: mainnet.id,
    });
  };

  const handleDeposit = () => {
    if (!parsedDepositAmount) return;
    depositWrite({
      abi: AURA_VAULT_ABI,
      address: AURA_VAULT_ADDRESS,
      functionName: "deposit",
      args: [parsedDepositAmount, address as Address],
      chainId: mainnet.id,
    });
  };

  // Refetch allowance after successful approval
  if (isApproveConfirmed) {
    refetchAllowance();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-semibold">Deposit Stablecoins</h3>
        <div className="text-right">
          <p className="text-sm text-neutral-500">Your Balance</p>
          <p className="font-mono text-lg">
            {userAssetBalance !== undefined && userAssetBalance !== null && typeof assetDecimals === "number"
              ? formatUnits(userAssetBalance as bigint, assetDecimals)
              : "0.00"} {assetSymbol || "USDC"}
          </p>
        </div>
      </div>

      <div className="relative">
        <input
          type="number"
          placeholder="0.00"
          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-4 pr-20 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-neutral-500">
          {assetSymbol || "USDC"}
        </span>
      </div>

      <p className="text-sm text-neutral-500">
        You will receive vault tokens (aToken) representing your share of the vault.
      </p>

      {needsApproval ? (
        <Button
          size="lg"
          className="w-full"
          onClick={handleApprove}
          disabled={isApprovePending || isApproveConfirming}
        >
          {isApprovePending || isApproveConfirming ? "Approving..." : "Approve"}
        </Button>
      ) : (
        <Button
          size="lg"
          className="w-full"
          onClick={handleDeposit}
          disabled={isDepositPending || isDepositConfirming || !depositAmount}
        >
          {isDepositPending || isDepositConfirming ? "Depositing..." : "Deposit"}
        </Button>
      )}

      {isApproveError && <p className="text-red-500 text-sm mt-2">Approval Error: {approveError?.message}</p>}
      {isDepositError && <p className="text-red-500 text-sm mt-2">Deposit Error: {depositError?.message}</p>}
    </div>
  );
};

const WithdrawTab = () => {
  const { address } = useAccount();
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  // Get vault token details (decimals, symbol) for display
  const { data: vaultDecimals } = useReadContract({
    abi: AURA_VAULT_ABI,
    address: AURA_VAULT_ADDRESS,
    functionName: "decimals",
    chainId: mainnet.id,
  });

  const { data: vaultSymbol } = useReadContract({
    abi: AURA_VAULT_ABI,
    address: AURA_VAULT_ADDRESS,
    functionName: "symbol",
    chainId: mainnet.id,
  });

  // Get user's vault share balance
  const { data: userVaultBalance } = useReadContract({
    abi: AURA_VAULT_ABI,
    address: AURA_VAULT_ADDRESS,
    functionName: "balanceOf",
    args: [address as Address],
    chainId: mainnet.id,
    query: {
      enabled: !!address,
    },
  });

  const parsedWithdrawAmount = withdrawAmount && vaultDecimals ? parseUnits(withdrawAmount as `${number}`, vaultDecimals) : 0n;

  // Withdraw transaction
  const {
    data: withdrawHash,
    writeContract: withdrawWrite,
    isPending: isWithdrawPending,
    isError: isWithdrawError,
    error: withdrawError,
  } = useWriteContract();

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawConfirmed } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    });

  const handleWithdraw = () => {
    if (!parsedWithdrawAmount) return;
    withdrawWrite({
      abi: AURA_VAULT_ABI,
      address: AURA_VAULT_ADDRESS,
      functionName: "withdraw",
      args: [parsedWithdrawAmount, address as Address, address as Address],
      chainId: mainnet.id,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-semibold">Withdraw Stablecoins</h3>
        <div className="text-right">
          <p className="text-sm text-neutral-500">Your Vault Position</p>
          <p className="font-mono text-lg">
            {userVaultBalance !== undefined && userVaultBalance !== null && typeof vaultDecimals === "number"
              ? formatUnits(userVaultBalance as bigint, vaultDecimals)
              : "0.00"} {vaultSymbol || "aToken"}
          </p>
        </div>
      </div>

      <div className="relative">
        <input
          type="number"
          placeholder="0.00"
          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-4 pr-20 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-neutral-500">
          {vaultSymbol || "aToken"}
        </span>
      </div>

      <p className="text-sm text-neutral-500">
        You will receive USDC back in your wallet. Withdrawals may be subject to a 0.1% fee.
      </p>

      <Button
        size="lg"
        className="w-full"
        onClick={handleWithdraw}
        disabled={isWithdrawPending || isWithdrawConfirming || !withdrawAmount}
        variant="outline"
      >
        {isWithdrawPending || isWithdrawConfirming ? "Withdrawing..." : "Withdraw"}
      </Button>

      {isWithdrawError && <p className="text-red-500 text-sm mt-2">Withdrawal Error: {withdrawError?.message}</p>}
    </div>
  );
};
