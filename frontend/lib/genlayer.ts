import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export const CHAIN_ID = 61999;
export const RPC_URL = "https://studio.genlayer.com/api";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined;

// Read-only client (no wallet needed)
export function readClient() {
  return createClient({ chain: studionet, endpoint: RPC_URL });
}

// Client that signs with the user's wallet
export function writeClient(account: `0x${string}`) {
  return createClient({ chain: studionet, endpoint: RPC_URL, account });
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<any>;
    };
  }
}

// Connects the wallet and makes sure it is on GenLayer Studionet.
export async function connectWallet(): Promise<`0x${string}`> {
  const eth = typeof window !== "undefined" ? window.ethereum : undefined;
  if (!eth) throw new Error("No wallet found. Install MetaMask and reload this page.");

  const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
  const chainIdHex = "0x" + CHAIN_ID.toString(16);

  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch {
    // Network not in the wallet yet: add it
    await eth.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainIdHex,
          chainName: "GenLayer Studionet",
          rpcUrls: [RPC_URL],
          nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
        },
      ],
    });
  }

  return accounts[0] as `0x${string}`;
}

export function shortAddress(a: string) {
  return a.slice(0, 6) + "…" + a.slice(-4);
}
