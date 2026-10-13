import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">404 — Not Found</h1>
      <Link href="/" className="text-primary underline">
        Go home
      </Link>
    </main>
  );
}
