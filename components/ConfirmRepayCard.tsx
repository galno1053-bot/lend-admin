"use client";

import { useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { formatIdr, hybridLoanManagerAbi } from "@pinjaman/shared";
import { CONTRACT_ADDRESS } from "../lib/config";
import { toRefHash } from "../lib/utils";

export default function ConfirmRepayCard({
  positionId,
  borrower,
  principalIdr
}: {
  positionId: bigint;
  borrower: string;
  principalIdr: bigint;
}) {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [repayRef, setRepayRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmRepay = async () => {
    if (!publicClient) return;
    setError(null);
    setLoading(true);
    try {
      const refHash = toRefHash(repayRef);
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: hybridLoanManagerAbi,
        functionName: "confirmRepay",
        args: [positionId, refHash]
      });
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirm repay failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="text-sm text-white/60">Position #{positionId.toString()}</div>
      <div className="text-lg font-semibold">Borrower: {borrower}</div>
      <div className="text-sm text-white/70">Principal: {formatIdr(principalIdr)} IDR</div>

      <input
        value={repayRef}
        onChange={(event) => setRepayRef(event.target.value)}
        placeholder="Repay reference"
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
      />
      <button
        onClick={confirmRepay}
        className="rounded-xl bg-lime-300 text-slate-900 px-4 py-2 text-sm font-semibold"
      >
        Confirm Repay
      </button>
      {error && <div className="text-xs text-rose-200">{error}</div>}
    </div>
  );
}
