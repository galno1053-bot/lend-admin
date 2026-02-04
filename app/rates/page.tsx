"use client";

import Link from "next/link";
import WalletGate from "../../components/WalletGate";
import RateUpdater from "../../components/RateUpdater";

export default function RatesPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-lg font-display">
          Naxa Finance Admin
        </Link>
        <div className="text-sm text-white/60">FX Rates</div>
      </header>

      <section className="mt-10 max-w-xl">
        <WalletGate>
          <RateUpdater />
        </WalletGate>
      </section>
    </main>
  );
}
