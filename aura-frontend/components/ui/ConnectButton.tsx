"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./Button";
import { LogOut } from "lucide-react";

export const ConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    // For simplicity, we'll use the first available connector.
    // In a real app, you'd want to present a modal with all options.
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono">
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </div>
        <Button variant="ghost" size="sm" onClick={() => disconnect()} aria-label="Disconnect">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} variant="outline">
      Connect Wallet
    </Button>
  );
};
