import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "64px 24px",
        textAlign: "center",
      }}
    >
      <div>
        <p className="mono">404</p>
        <h1>That page is not part of this setup.</h1>
        <p>Return to the catalogue and continue from a verified product.</p>
        <Link href="/products">Browse products</Link>
      </div>
    </main>
  );
}
