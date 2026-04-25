"use client";
import { TOP_FEATURES, DIM_COLORS } from "@/lib/data";

const DIM_LABELS: Record<string, string> = {
  financial: "Financial",
  dwelling:  "Dwelling",
  tenure:    "Tenure",
  hazard:    "Hazard",
  utility:   "Utility",
  spatial:   "Spatial",
};

const MAX_MI = Math.max(...TOP_FEATURES.map((f) => f.mi));

function cleanName(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FeatureImportance() {
  const dims = [...new Set(TOP_FEATURES.map((f) => f.dim))];

  return (
    <section id="features" style={{ paddingTop: "80px", paddingBottom: "80px", background: "var(--surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "48px" }}
          className="responsive-2col">
          <div>
            <p className="section-head">SHAP Feature Importance</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "14px" }}>
              What drives{" "}
              <em style={{ color: "var(--amber)", fontStyle: "italic" }}>vulnerability?</em>
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.75 }}>
              Mutual information scores from the XGBoost model identify which household
              characteristics most strongly determine HFVS. Savings behaviour and
              dwelling quality dominate — structural, not geographic, factors lead.
            </p>
          </div>

          {/* Dimension pie summary */}
          <div style={{
            background: "var(--card)", border: "0.5px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: "1.25rem",
          }}>
            <p style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              MI contribution by dimension
            </p>
            {dims.map((d) => {
              const total = TOP_FEATURES.filter((f) => f.dim === d).reduce((s, f) => s + f.mi, 0);
              const grandTotal = TOP_FEATURES.reduce((s, f) => s + f.mi, 0);
              const pct = (total / grandTotal) * 100;
              return (
                <div key={d} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: DIM_COLORS[d] }}>{DIM_LABELS[d]}</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{pct.toFixed(1)}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: DIM_COLORS[d] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature bars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "8px" }}>
          {TOP_FEATURES.map((f, i) => {
            const color = DIM_COLORS[f.dim];
            return (
              <div key={f.name} style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "var(--card)", borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                borderLeft: `3px solid ${color}`,
              }}>
                <div style={{ width: "20px", fontSize: "11px", color: "var(--dim)", textAlign: "right", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cleanName(f.name)}
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color, flexShrink: 0, marginLeft: "8px" }}>
                      {f.mi.toFixed(3)}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(f.mi / MAX_MI) * 100}%`, background: color, opacity: 0.8 }} />
                  </div>
                </div>
                <div style={{
                  fontSize: "9px", fontWeight: 600, padding: "2px 7px",
                  borderRadius: "100px", background: `${color}20`, color,
                  letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0,
                }}>
                  {DIM_LABELS[f.dim]}
                </div>
              </div>
            );
          })}
        </div>

        {/* SHAP interpretation note */}
        <div style={{
          marginTop: "40px", padding: "1.25rem 1.5rem",
          background: "var(--card)", borderRadius: "var(--radius-md)",
          border: "0.5px solid var(--border)", display: "flex", gap: "16px", alignItems: "flex-start",
        }}>
          <div style={{ fontSize: "24px", flexShrink: 0 }}>💡</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: "6px", fontSize: "14px" }}>Interpreting mutual information</div>
            <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.7 }}>
              Mutual information (MI) measures the statistical dependency between each feature and the HFVS target,
              regardless of relationship type. MI = 0 means complete independence; higher values indicate stronger
              predictive signal. These scores complement SHAP values computed from the trained XGBoost model,
              which additionally capture interaction effects and directional contributions.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .responsive-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
