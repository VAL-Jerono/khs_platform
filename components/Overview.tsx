"use client";
import { DIMENSIONS, NATIONAL } from "@/lib/data";

const FINDINGS = [
  {
    color: "var(--amber)",
    title: "Savings capacity is the single strongest predictor",
    body: "Mutual information scores confirm that savings_rate (MI = 0.142) and no_savings (MI = 0.138) dominate the HFVS model — more than any structural or geographic feature. Financial resilience precedes physical risk.",
  },
  {
    color: "var(--purple)",
    title: "Dwelling quality signals cluster in the top 5 features",
    body: "Three dwelling-material indicators — structural_durability, floor_durable, wall_durable — rank 3rd, 6th and 8th. Informal construction is a proxy for poverty AND hazard exposure simultaneously.",
  },
  {
    color: "var(--red)",
    title: "Arid and ASAL counties dominate the high-risk tier",
    body: "Tana River (0.403), Trans Nzoia (0.384) and West Pokot (0.375) lead the risk ranking. All three combine high utility deprivation with financial stress — a compounding vulnerability double-bind.",
  },
  {
    color: "var(--teal)",
    title: "Nairobi's 100% urbanisation masks individual-level stress",
    body: "Nairobi has the lowest county HFVS (0.283) yet 19% of households exceed the high-vulnerability threshold — the largest absolute count nationally, owing to its 678-household representation.",
  },
];

export default function Overview() {
  return (
    <section id="overview" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: "48px", maxWidth: "640px" }}>
          <p className="section-head">Methodology</p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700, lineHeight: 1.1, marginBottom: "16px",
          }}>
            Five risk dimensions.<br />
            <em style={{ fontStyle: "italic", color: "var(--amber)" }}>One composite score.</em>
          </h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "15px" }}>
            The Housing Financial Vulnerability Score (HFVS) aggregates five independently
            measured risk dimensions from KHS microdata into a single household-level index.
            Weights are grounded in actuarial precedent and validated via PCA loading structure.
          </p>
        </div>

        {/* Dimension cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "10px", marginBottom: "64px",
        }}>
          {DIMENSIONS.map((d) => (
            <div key={d.key} style={{
              background: "var(--card)", border: "0.5px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: "1.1rem",
              borderTop: `2px solid ${d.color}`,
            }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em",
                            textTransform: "uppercase", color: d.color, marginBottom: "6px" }}>
                {d.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700 }}>
                  {(d.weight * 100).toFixed(0)}
                </span>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>% weight</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>

        {/* HFVS formula */}
        <div style={{
          background: "var(--surface)", border: "0.5px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "1.5rem 2rem", marginBottom: "64px",
          overflow: "auto",
        }}>
          <p style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "12px",
                      letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Composite formula
          </p>
          <div style={{ fontFamily: "monospace", fontSize: "14px", color: "var(--text)", lineHeight: 1.9 }}>
            <span style={{ color: "var(--amber)", fontWeight: 700 }}>HFVS</span>
            {" = "}<span style={{ color: "var(--amber)" }}>0.30</span>·Fin_stress
            {" + "}<span style={{ color: "var(--red)" }}>0.25</span>·Tenure_insec
            {" + "}<span style={{ color: "var(--blue)" }}>0.25</span>·Phys_hazard
            {" + "}<span style={{ color: "var(--purple)" }}>0.20</span>·Dwelling_qual
            {" + "}<span style={{ color: "var(--teal)" }}>0.20</span>·Utility_depriv
          </div>
          <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
            {[
              { label: "Nat. mean", value: NATIONAL.mean.toFixed(4), col: "var(--text)" },
              { label: "Nat. median", value: NATIONAL.median.toFixed(4), col: "var(--text)" },
              { label: "Std deviation", value: NATIONAL.sd.toFixed(4), col: "var(--amber)" },
              { label: "Min / Max", value: `${NATIONAL.range[0]} – ${NATIONAL.range[1]}`, col: "var(--muted)" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                <div style={{ fontFamily: "monospace", fontSize: "16px", color: s.col, fontWeight: 600 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key findings */}
        <p className="section-head">Key Findings</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
          {FINDINGS.map((f, i) => (
            <div key={i} style={{
              background: "var(--surface)",
              border: "0.5px solid var(--border)",
              borderLeft: `3px solid ${f.color}`,
              borderRadius: "var(--radius-md)", padding: "1.1rem",
            }}>
              <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "7px" }}>{f.title}</div>
              <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.65 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
