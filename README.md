# Lend Admin (Admin Panel)

## Setup

```bash
pnpm install
```

Copy env:

```bash
cp .env.example .env
```

Isi env utama:

- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` (atau BASE mainnet)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_ADDRESSES`
- `ADMIN_BASIC_AUTH_USER` / `ADMIN_BASIC_AUTH_PASS` (opsional)

Run:

```bash
pnpm dev
```

## Deploy Vercel

Root directory: `lend-admin`

Set env seperti di `.env.example`.
