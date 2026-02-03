import { keccak256, stringToBytes } from "viem";

export function toRefHash(value: string) {
  if (value.startsWith("0x") && value.length === 66) {
    return value as `0x${string}`;
  }
  return keccak256(stringToBytes(value));
}

export function formatTimestamp(seconds: bigint | number) {
  const num = typeof seconds === "bigint" ? Number(seconds) : seconds;
  return new Date(num * 1000).toLocaleString("id-ID");
}
