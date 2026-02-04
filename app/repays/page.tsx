"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { hybridLoanManagerAbi } from "@pinjaman/shared";
import WalletGate from "../../components/WalletGate";
import ConfirmRepayCard from "../../components/ConfirmRepayCard";
import { CONTRACT_ADDRESS } from "../../lib/config";

export default function RepaysPage() {
  const nextId = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: hybridLoanManagerAbi,
    functionName: "nextPositionId"
  });

  const ids = useMemo(() => {
    const total = Number(nextId.data ?? 0n);
    return Array.from({ length: total }, (_, idx) => BigInt(idx));
  }, [nextId.data]);

  const positionCalls = ids.map((id) => ({
    address: CONTRACT_ADDRESS,
    abi: hybridLoanManagerAbi,
    functionName: "positions" as const,
    args: [id] as const
  }));

  const positions = useReadContracts({
    contracts: positionCalls,
    query: { enabled: positionCalls.length > 0 }
  });

  const repayItems =
    positions.data
      ?.map((result, idx) => {
        const data = result.result as any;
        if (!data) return null;
        return {
          id: ids[idx],
          status: Number(data[7]),
          borrower: data[1] as string,
          principalIdr: data[4] as bigint
        };
      })
      .filter((item) => item && item.status === 2) ?? [];

  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-lg font-display">
          Naxa Finance Admin
        </Link>
        <div className="text-sm text-white/60">Repays</div>
      </header>

      <section className="mt-10">
        <WalletGate>
          <div className="grid gap-4">
            {repayItems.length === 0 && (
              <div className="text-white/60 text-sm">No repay requests.</div>
            )}
            {repayItems.map((item) => (
              <ConfirmRepayCard
                key={item.id.toString()}
                positionId={item.id}
                borrower={item.borrower}
                principalIdr={item.principalIdr}
              />
            ))}
          </div>
        </WalletGate>
      </section>
    </main>
  );
}
