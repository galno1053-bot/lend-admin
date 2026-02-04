"use client";

import { useState } from "react";
import { usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { hybridLoanManagerAbi } from "@pinjaman/shared";
import { CONTRACT_ADDRESS } from "../lib/config";
import { formatTimestamp } from "../lib/utils";

export default function RateUpdater() {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const usdIdrRate = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: hybridLoanManagerAbi,
    functionName: "usdIdrRate"
  });

  const usdIdrUpdatedAt = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: hybridLoanManagerAbi,
    functionName: "usdIdrUpdatedAt"
  });

  const isStale = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: hybridLoanManagerAbi,
    functionName: "isFxRateStale"
  });

  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRate = async () => {
    if (!publicClient) return;
    setError(null);
    setLoading(true);
    try {
      const numericRate = Number(rate);
      if (!numericRate || numericRate <= 0) {
        throw new Error("Invalid rate");
      }
      const rateWithDecimals = BigInt(Math.round(numericRate * 1e8));
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: hybridLoanManagerAbi,
        functionName: "setUsdIdrRate",
        args: [rateWithDecimals]
      });
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rate update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-3">
      <div className="text-sm text-white/60">USD/IDR Onchain</div>
      <div className="text-2xl font-semibold">
        {usdIdrRate.data ? Number(usdIdrRate.data) / 1e8 : "-"}
      </div>
      <div className="text-xs text-white/60">
        Updated: {usdIdrUpdatedAt.data ? formatTimestamp(usdIdrUpdatedAt.data) : "-"}
      </div>
      {isStale.data && (
        <div className="text-xs text-amber-200">Rate is stale (older than 60 minutes).</div>
      )}

      <input
        value={rate}
        onChange={(event) => setRate(event.target.value)}
        placeholder="15000"
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
      />
      <button
        onClick={submitRate}
        className="rounded-xl bg-cobalt text-white px-4 py-2 text-sm font-semibold"
      >
        {loading ? "Updating..." : "Update USD/IDR"}
      </button>
      {error && <div className="text-xs text-rose-200">{error}</div>}
    </div>
  );
}
