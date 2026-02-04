"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { hybridLoanManagerAbi } from "@pinjaman/shared";
import WalletGate from "../../components/WalletGate";
import LiquidationList from "../../components/LiquidationList";
import { CONTRACT_ADDRESS } from "../../lib/config";

export default function LiquidationsPage() {
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

  const ltvCalls = ids.map((id) => ({
    address: CONTRACT_ADDRESS,
    abi: hybridLoanManagerAbi,
    functionName: "getLtvNow" as const,
    args: [id] as const
  }));

  const positions = useReadContracts({
    contracts: positionCalls,
    query: { enabled: positionCalls.length > 0 }
  });

  const ltvs = useReadContracts({
    contracts: ltvCalls,
    query: { enabled: ltvCalls.length > 0 }
  });

  const items =
    ids
      .map((id, idx) => {
        const position = positions.data?.[idx]?.result as any;
        const ltv = ltvs.data?.[idx]?.result as bigint | undefined;
        if (!position || ltv === undefined) return null;
        return {
          positionId: id,
          borrower: position[1] as string,
          status: Number(position[7]),
          ltvBps: ltv
        };
      })
      .filter(
        (item) =>
          item &&
          (item.status === 1 || item.status === 2) &&
          Number(item.ltvBps) >= 9500
      ) ?? [];

  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-lg font-display">
          Naxa Finance Admin
        </Link>
        <div className="text-sm text-white/60">Liquidations</div>
      </header>

      <section className="mt-10">
        <WalletGate>
          <LiquidationList items={items as any} />
        </WalletGate>
      </section>
    </main>
  );
}
