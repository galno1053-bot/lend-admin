"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "../lib/wagmi";

type AdminConfig = {
  allowlist: string[];
};

const AdminConfigContext = createContext<AdminConfig>({ allowlist: [] });

export function useAdminConfig() {
  return useContext(AdminConfigContext);
}

export default function Providers({
  children,
  allowlist
}: PropsWithChildren<{ allowlist: string[] }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AdminConfigContext.Provider value={{ allowlist }}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </AdminConfigContext.Provider>
  );
}
