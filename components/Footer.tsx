"use client";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--surface)", borderTop: "0.5px solid var(--border)",
      padding: "48px 0 32px",
    }}>
      <div className="container">
        <div className="footer-grid" style={{ marginBottom: "40px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
              HFVS Kenya
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7, maxWidth: "320px" }}>
              Housing Financial Vulnerability Score — a multi-dimensional actuarial risk index
              modelled from the 2023/24 Kenya Housing Survey (KNBS). MSc Data Science & Analytics
              dissertation, Strathmore University, 2026.
            </p>
            <p style={{ fontSize: "11px", color: "var(--dim)", marginTop: "14px" }}>
              Data: 21,347 households · 47 counties · Kenya National Data Archive
            </p>
          </div>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>Explore</p>
            {["#overview|Methodology","#counties|County Atlas","#model|Model Results","#features|Feature Importance","#calculator|HFVS Calculator"].map((l) => {
              const [href, label] = l.split("|");
              return <a key={href} href={href} className="footer-link">{label}</a>;
            })}
          </div>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>Resources</p>
            {[
              ["https://www.knbs.or.ke","KNBS"],
              ["https://www.knada.knbs.or.ke","Kenya Data Archive"],
              ["https://www.ira.go.ke","IRA Kenya"],
              ["https://www.strathmore.edu","Strathmore University"],
            ].map(([href, label]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="footer-link">{label} ↗</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "var(--dim)" }}>© 2026 · MSc Data Science & Analytics · Strathmore University</p>
          <p style={{ fontSize: "12px", color: "var(--dim)" }}>Built with Next.js · Deployed on Vercel</p>
        </div>
      </div>
      <style>{`
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
        .footer-link { display: block; font-size: 13px; color: var(--muted); text-decoration: none; margin-bottom: 8px; transition: color 0.15s; }
        .footer-link:hover { color: var(--text); }
        @media (max-width: 640px) { .footer-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}
