"use client";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "#overview",  label: "Overview"  },
  { href: "#counties",  label: "Counties"  },
  { href: "#model",     label: "Model"     },
  { href: "#features",  label: "Features"  },
  { href: "#calculator",label: "Calculator"},
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(7,12,23,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.07)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: "20px",
              fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em",
            }}>HFVS</span>
            <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.06em" }}>
              KENYA 2023/24
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}
          className="hidden sm:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{
              fontSize: "13px", fontWeight: 500, color: "var(--muted)",
              padding: "6px 14px", borderRadius: "6px", textDecoration: "none",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "var(--text)";
              (e.target as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "var(--muted)";
              (e.target as HTMLElement).style.background = "transparent";
            }}>
              {l.label}
            </a>
          ))}
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{
            marginLeft: "8px", padding: "6px 16px", fontSize: "12px", fontWeight: 600,
            border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: "6px",
            color: "var(--text)", textDecoration: "none",
            transition: "border-color 0.15s, background 0.15s",
          }}>
            GitHub →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", fontSize: "20px" }}
          className="sm:hidden">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "rgba(7,12,23,0.98)", borderTop: "0.5px solid var(--border)",
          padding: "12px 24px 20px",
        }} className="sm:hidden">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "10px 0", fontSize: "14px",
                       color: "var(--muted)", textDecoration: "none",
                       borderBottom: "0.5px solid var(--border)" }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
