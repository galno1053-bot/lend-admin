import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyMessage } from "viem";
import { buildAdminAccessMessage } from "@pinjaman/shared";
import { getSupabaseServerClient } from "@pinjaman/db/client";

const schema = z.object({
  offchainRefHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  address: z.string(),
  signature: z.string(),
  message: z.string(),
  timestamp: z.string(),
  chainId: z.string()
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const payload = schema.parse({
      offchainRefHash: searchParams.get("offchainRefHash"),
      address: searchParams.get("address"),
      signature: searchParams.get("signature"),
      message: searchParams.get("message"),
      timestamp: searchParams.get("timestamp"),
      chainId: searchParams.get("chainId")
    });

    const allowlist = (process.env.ADMIN_ADDRESSES ?? "")
      .split(",")
      .map((addr) => addr.trim().toLowerCase())
      .filter(Boolean);

    if (!allowlist.includes(payload.address.toLowerCase())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const expectedMessage = buildAdminAccessMessage({
      address: payload.address,
      timestamp: payload.timestamp,
      chainId: payload.chainId
    });

    if (expectedMessage !== payload.message) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const isValid = await verifyMessage({
      address: payload.address as `0x${string}`,
      message: payload.message,
      signature: payload.signature as `0x${string}`
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("bank_details")
      .select("*")
      .eq("offchain_ref_hash", payload.offchainRefHash)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
