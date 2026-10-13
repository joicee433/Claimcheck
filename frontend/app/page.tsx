import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Does this page really say that?
      </h1>
      <p className="mt-5 max-w-prose text-lg text-ink/80">
        Paste a claim and one link. GenLayer validators read the page and vote:
        supported, not supported, or cannot verify.
      </p>
      <Link
        href="/new"
        className="mt-8 inline-block rounded-md bg-ink px-5 py-3 font-medium text-white hover:bg-accent"
      >
        Check a claim
      </Link>
    </div>
  );
}
