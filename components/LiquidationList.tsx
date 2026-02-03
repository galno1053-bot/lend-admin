"use client";

import { usePublicClient, useWriteContract } from "wagmi";
import { useState } from "react";
import { hybridLoanManagerAbi } from "@pinjaman/shared";
import { CONTRACT_ADDRESS } from "../lib/config";

type Item = {
  positionId: bigint;
  borrower: string;
  ltvBps: bigint;
};

export default function LiquidationList({ items }: { items: Item[] }) {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [loadingId, setLoadingId] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const liquidate = async (positionId: bigint) => {
    if (!publicClient) return;
    setError(null);
    setLoadingId(positionId);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: hybridLoanManagerAbi,
        functionName: "liquidate",
        args: [positionId]
      });
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal liquidate");
    } finally {
      setLoadingId(null);
    }
  };

  if (!items.length) {
    return <div className="text-sm text-white/60">Tidak ada posisi liquidatable.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.positionId.toString()} className="glass-card p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60">Position #{item.positionId.toString()}</div>
            <div className="text-sm">Borrower: {item.borrower}</div>
            <div className="text-xs text-rose-200">LTV: {(Number(item.ltvBps) / 100).toFixed(2)}%</div>
          </div>
          <button
            onClick={() => liquidate(item.positionId)}
            className="rounded-xl bg-rose-400 text-slate-900 px-4 py-2 text-xs font-semibold"
            disabled={loadingId === item.positionId}
          >
            {loadingId === item.positionId ? "Processing..." : "Liquidate"}
          </button>
        </div>
      ))}
      {error && <div className="text-xs text-rose-200">{error}</div>}
    </div>
  );
}
