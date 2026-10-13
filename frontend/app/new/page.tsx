"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionStatus } from "genlayer-js/types";
import {
  CONTRACT_ADDRESS,
  connectWallet,
  readClient,
  shortAddress,
  writeClient,
} from "@/lib/genlayer";

const MAX_CLAIM = 400;
const MAX_URL = 200;

export default function NewCheck() {
  const router = useRouter();
  const [claim, setClaim] = useState("");
  const [url, setUrl] = useState("");
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onConnect() {
    setError("");
    try {
      setAddress(await connectWallet());
    } catch (e: any) {
      setError(e?.message ?? "Could not connect the wallet.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!CONTRACT_ADDRESS) {
      setError("NEXT_PUBLIC_CONTRACT_ADDRESS is not set. See the README, step 3.");
      return;
    }
    if (!claim.trim() || claim.length > MAX_CLAIM) {
      setError(`The claim must be 1 to ${MAX_CLAIM} characters.`);
      return;
    }
    if (!/^https?:\/\//.test(url) || url.length > MAX_URL) {
      setError(`The link must start with http:// or https:// and be at most ${MAX_URL} characters.`);
      return;
    }

    setBusy(true);
    try {
      const account = address ?? (await connectWallet());
      setAddress(account);

      // The new check will get this id
      const id = String(
        await readClient().readContract({
          address: CONTRACT_ADDRESS,
          functionName: "next_id",
          args: [],
        })
      );

      setMessage("Confirm the transaction in your wallet…");
      const client = writeClient(account);
      const hash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "check",
        args: [claim.trim(), url.trim()],
        value: BigInt(0),
      });

      setMessage(
        "Sent. Validators are now reading the page and voting. Consensus can take a few minutes. Keep this tab open."
      );
      await client.waitForTransactionReceipt({
        hash,
        status: TransactionStatus.ACCEPTED,
        interval: 5000,
        retries: 120,
      });

      router.push(`/c/${id}`);
    } catch (e: any) {
      setError(e?.shortMessage ?? e?.message ?? "Something went wrong.");
      setBusy(false);
      setMessage("");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Check a claim</h1>
      <p className="mt-3 text-ink/80">
        Use a short claim and one link to a page that should confirm it.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="claim" className="block font-medium">
            Claim
          </label>
          <textarea
            id="claim"
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            maxLength={MAX_CLAIM}
            rows={4}
            disabled={busy}
            className="mt-2 w-full rounded-md border border-line bg-white p-3"
            placeholder="The Eiffel Tower is 330 metres tall."
          />
          <p className="mt-1 text-sm text-ink/60">
            {claim.length} / {MAX_CLAIM}
          </p>
        </div>

        <div>
          <label htmlFor="url" className="block font-medium">
            Link to the page
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            maxLength={MAX_URL}
            disabled={busy}
            className="mt-2 w-full rounded-md border border-line bg-white p-3"
            placeholder="https://en.wikipedia.org/wiki/Eiffel_Tower"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onConnect}
            disabled={busy}
            className="rounded-md border border-ink px-4 py-2 font-medium hover:bg-white disabled:opacity-50"
          >
            {address ? `Connected: ${shortAddress(address)}` : "Connect wallet"}
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-ink px-5 py-2 font-medium text-white hover:bg-accent disabled:opacity-50"
          >
            {busy ? "Working…" : "Submit claim"}
          </button>
        </div>
      </form>

      {message && (
        <p role="status" className="mt-6 rounded-md border border-line bg-white p-4">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 rounded-md border border-no bg-white p-4 text-no">
          {error}
        </p>
      )}
    </div>
  );
}
