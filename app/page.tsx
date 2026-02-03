import Link from "next/link";
import WalletGate from "../components/WalletGate";

export default function AdminHome() {
  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between">
        <div className="text-lg font-display">Pinjaman Admin</div>
        <div className="text-sm text-white/60">Dashboard</div>
      </header>

      <section className="mt-10">
        <WalletGate>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/payouts" className="glass-card p-6 hover:border-copper/50 transition">
              <div className="text-sm text-white/60">Payouts</div>
              <div className="text-xl font-semibold">Confirm Payout</div>
            </Link>
            <Link href="/repays" className="glass-card p-6 hover:border-lime/50 transition">
              <div className="text-sm text-white/60">Repays</div>
              <div className="text-xl font-semibold">Confirm Repay</div>
            </Link>
            <Link href="/rates" className="glass-card p-6 hover:border-cobalt/50 transition">
              <div className="text-sm text-white/60">FX Oracle</div>
              <div className="text-xl font-semibold">Update USD/IDR</div>
            </Link>
            <Link href="/liquidations" className="glass-card p-6 hover:border-rose-400/50 transition">
              <div className="text-sm text-white/60">Liquidations</div>
              <div className="text-xl font-semibold">Monitor LTV</div>
            </Link>
          </div>
        </WalletGate>
      </section>
    </main>
  );
}
