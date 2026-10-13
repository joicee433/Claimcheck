"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CONTRACT_ADDRESS, readClient } from "@/lib/genlayer";

type Check = { verdict: string; reason: string; claim: string; url: string };

const LOOK: Record<string, { label: string; color: string }> = {
  SUPPORTED: { label: "Supported", color: "text-yes border-yes" },
  NOT_SUPPORTED: { label: "Not supported", color: "text-no border-no" },
  CANNOT_VERIFY: { label: "Cannot verify", color: "text-maybe border-maybe" },
};

export default function CheckPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [check, setCheck] = useState<Check | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!CONTRACT_ADDRESS) {
      setError("NEXT_PUBLIC_CONTRACT_ADDRESS is not set. See the README, step 3.");
      return;
    }
    let stop = false;

    async function load() {
      try {
        const raw = await readClient().readContract({
          address: CONTRACT_ADDRESS!,
          functionName: "get_check",
          args: [id],
        });
        const text = String(raw ?? "");
        if (text && !stop) {
          setCheck(JSON.parse(text));
          return true;
        }
      } catch (e: any) {
        if (!stop) setError(e?.shortMessage ?? e?.message ?? "Could not load this check.");
      }
      return false;
    }

    // Try now, then every 10 seconds until the result exists
    load();
    const timer = setInterval(async () => {
      if (await load()) clearInterval(timer);
    }, 10000);

    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [id]);

  if (error) {
    return (
      <p role="alert" className="rounded-md border border-no bg-white p-4 text-no">
        {error}
      </p>
    );
  }

  if (!check) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Check #{id}</h1>
        <p role="status" className="mt-6 rounded-md border border-line bg-white p-4">
          No result yet. Consensus can take a few minutes. This page looks again every 10 seconds.
        </p>
      </div>
    );
  }

  const look = LOOK[check.verdict] ?? LOOK.CANNOT_VERIFY;

  return (
    <div>
      <p className="text-sm text-ink/60">Check #{id}</p>
      <h1 className={`mt-2 inline-block border-4 px-4 py-2 text-4xl font-bold tracking-tight ${look.color}`}>
        {look.label}
      </h1>
      <p className="mt-6 text-xl">{check.reason}</p>

      <dl className="mt-10 space-y-6 border-t border-line pt-6">
        <div>
          <dt className="text-sm font-medium text-ink/60">Claim</dt>
          <dd className="mt-1 break-words">{check.claim}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-ink/60">Page checked</dt>
          <dd className="mt-1 break-all">
            <a href={check.url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
              {check.url}
            </a>
          </dd>
        </div>
      </dl>

      <Link href="/new" className="mt-10 inline-block font-medium text-accent underline underline-offset-4">
        Check another claim
      </Link>
    </div>
  );
}
