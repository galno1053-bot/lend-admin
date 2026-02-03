"use client";

import { PropsWithChildren } from "react";
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors/injected";
import { useAdminConfig } from "../app/providers";
import { TARGET_CHAIN_ID } from "../lib/config";

export default function WalletGate({ children }: PropsWithChildren) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { allowlist } = useAdminConfig();

  if (!isConnected) {
    return (
      <div className="glass-card p-6">
        <div className="text-lg font-display mb-3">Admin Access</div>
        <button
          onClick={() => connect({ connector: injected() })}
          className="rounded-xl bg-amber-300 text-slate-900 px-4 py-2 text-sm font-semibold"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const isAllowed = address ? allowlist.includes(address.toLowerCase()) : false;

  if (!isAllowed) {
    return (
      <div className="glass-card p-6 text-rose-200">
        Wallet tidak terdaftar sebagai admin.
        <button
          onClick={() => disconnect()}
          className="mt-4 rounded-xl border border-white/20 px-4 py-2 text-xs text-white/70"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (chainId !== TARGET_CHAIN_ID) {
    return (
      <div className="glass-card p-6">
        <div className="text-sm text-white/70 mb-3">Network salah.</div>
        <button
          onClick={() => switchChain({ chainId: TARGET_CHAIN_ID })}
          className="rounded-xl bg-amber-300 text-slate-900 px-4 py-2 text-sm font-semibold"
        >
          Switch Network
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
