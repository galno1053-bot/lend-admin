"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useSignMessage, useWriteContract } from "wagmi";
import { buildAdminAccessMessage, formatIdr } from "@pinjaman/shared";
import { hybridLoanManagerAbi } from "@pinjaman/shared";
import { CONTRACT_ADDRESS, TARGET_CHAIN_ID } from "../lib/config";
import { toRefHash } from "../lib/utils";

type BankDetails = {
  recipient_name: string;
  bank_name: string;
  account_number: string;
  wallet_address: string;
};

export default function ConfirmPayoutCard({
  positionId,
  borrower,
  principalIdr,
  offchainRefHash
}: {
  positionId: bigint;
  borrower: string;
  principalIdr: bigint;
  offchainRefHash: `0x${string}`;
}) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();

  const [payoutRef, setPayoutRef] = useState("");
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBankDetails = async () => {
    if (!address) return;
    setError(null);
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const message = buildAdminAccessMessage({
        address,
        timestamp,
        chainId: String(TARGET_CHAIN_ID)
      });
      const signature = await signMessageAsync({ message });

      const res = await fetch(
        `/api/admin/bank-details?offchainRefHash=${offchainRefHash}&address=${address}&signature=${signature}&message=${encodeURIComponent(
          message
        )}&timestamp=${encodeURIComponent(timestamp)}&chainId=${TARGET_CHAIN_ID}`
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to fetch bank details");
      }

      const data = await res.json();
      setBankDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bank details");
    } finally {
      setLoading(false);
    }
  };

  const confirmPayout = async () => {
    if (!publicClient) return;
    setError(null);
    setLoading(true);
    try {
      const refHash = toRefHash(payoutRef);
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: hybridLoanManagerAbi,
        functionName: "confirmPayout",
        args: [positionId, refHash]
      });
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirm payout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="text-sm text-white/60">Position #{positionId.toString()}</div>
      <div className="text-lg font-semibold">Borrower: {borrower}</div>
      <div className="text-sm text-white/70">Principal: {formatIdr(principalIdr)} IDR</div>

      <button
        onClick={fetchBankDetails}
        className="rounded-xl border border-white/20 px-4 py-2 text-xs text-white/70"
      >
        {loading ? "Loading..." : "Fetch Bank Details"}
      </button>

      {bankDetails && (
        <div className="text-xs text-white/70 space-y-1">
          <div>Name: {bankDetails.recipient_name}</div>
          <div>Bank: {bankDetails.bank_name}</div>
          <div>Account: {bankDetails.account_number}</div>
          <div>Wallet: {bankDetails.wallet_address}</div>
        </div>
      )}

      <input
        value={payoutRef}
        onChange={(event) => setPayoutRef(event.target.value)}
        placeholder="Payout reference"
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
      />
      <button
        onClick={confirmPayout}
        className="rounded-xl bg-emerald-300 text-slate-900 px-4 py-2 text-sm font-semibold"
      >
        Confirm Payout
      </button>
      {error && <div className="text-xs text-rose-200">{error}</div>}
    </div>
  );
}
