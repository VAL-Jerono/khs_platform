import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px",
    }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "120px", fontWeight: 700, color: "var(--amber)", lineHeight: 1, marginBottom: "16px" }}>
        404
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 600, marginBottom: "12px" }}>
        County not found
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "32px", maxWidth: "360px", lineHeight: 1.7 }}>
        This page doesn't exist. Kenya has 47 counties — make sure you're looking at one of them.
      </p>
      <Link href="/" style={{
        background: "var(--amber)", color: "#1a0e00", padding: "11px 28px",
        borderRadius: "6px", fontWeight: 600, fontSize: "14px", textDecoration: "none",
      }}>
        Back to Dashboard
      </Link>
    </main>
  );
}
