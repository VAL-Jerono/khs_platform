"use client";
import { useState, useMemo } from "react";
import { COUNTIES, NATIONAL, DIMENSIONS, getRiskColor, getRiskTier, type County } from "@/lib/data";

type SortKey = "hfvs" | "pct_high" | "pct_urban" | "n_households";
type Dim = "hfvs" | "d1" | "d2" | "d3" | "d4" | "d5";

const DIM_OPTIONS: { key: Dim; label: string }[] = [
  { key: "hfvs", label: "Composite HFVS" },
  { key: "d1",   label: "Financial Stress" },
  { key: "d2",   label: "Tenure Insecurity" },
  { key: "d3",   label: "Physical Hazard" },
  { key: "d4",   label: "Dwelling Quality" },
  { key: "d5",   label: "Utility Deprivation" },
];

const DIM_COLORS: Record<Dim, string> = {
  hfvs: "#F2A836",
  d1:   "#F2A836",
  d2:   "#E25A38",
  d3:   "#4A8EE0",
  d4:   "#8B7BE8",
  d5:   "#35A882",
};

function RiskBadge({ hfvs }: { hfvs: number }) {
  const tier = getRiskTier(hfvs);
  return (
    <span className={`badge ${tier === "HIGH" ? "badge-high" : tier === "ABOVE MEAN" ? "badge-above" : "badge-below"}`}>
      {tier}
    </span>
  );
}

function CountyModal({ county, onClose }: { county: County; onClose: () => void }) {
  const max = Math.max(...DIMENSIONS.map((d) => county[d.key as Dim] as number));
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(7,12,23,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--card)", border: "0.5px solid var(--border-md)",
        borderRadius: "var(--radius-lg)", padding: "28px", maxWidth: "520px", width: "100%",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px", letterSpacing: "0.06em" }}>COUNTY PROFILE</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 700, marginBottom: "6px" }}>
              {county.name}
            </h3>
            <RiskBadge hfvs={county.hfvs} />
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "20px", cursor: "pointer" }}>✕</button>
        </div>

        {/* Composite score */}
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius-md)", padding: "16px",
          marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "52px", fontWeight: 700, color: getRiskColor(county.hfvs), lineHeight: 1 }}>
            {county.hfvs.toFixed(3)}
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.06em" }}>COMPOSITE HFVS</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
              National mean: {NATIONAL.mean.toFixed(3)} · σ = {NATIONAL.sd.toFixed(3)}
            </div>
            <div style={{ fontSize: "12px", marginTop: "4px" }}>
              {county.pct_high * 100 | 0}% households high-risk
            </div>
          </div>
        </div>

        {/* Dimension breakdown */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
            Dimension breakdown
          </p>
          {DIMENSIONS.map((d) => {
            const val = county[d.key as Dim] as number;
            return (
              <div key={d.key} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ color: d.color }}>{d.label}</span>
                  <span style={{ fontWeight: 600 }}>{val.toFixed(3)}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(val / 0.5) * 100}%`, background: d.color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[
            { label: "Urban", value: `${(county.pct_urban * 100).toFixed(0)}%` },
            { label: "Households", value: county.n_households.toLocaleString() },
            { label: "County ID", value: `#${county.id}` },
          ].map((s) => (
            <div key={s.label} style={{
              background: "var(--surface)", borderRadius: "var(--radius-sm)",
              padding: "10px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 600, marginTop: "2px" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CountyRankings() {
  const [view, setView] = useState<"bars" | "table">("bars");
  const [dim, setDim] = useState<Dim>("hfvs");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<County | null>(null);

  const sorted = useMemo(() => {
    return [...COUNTIES]
      .filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => (b[dim] as number) - (a[dim] as number));
  }, [dim, filter]);

  const maxVal = useMemo(() => Math.max(...COUNTIES.map((c) => c[dim] as number)), [dim]);

  return (
    <section id="counties" style={{ paddingTop: "80px", paddingBottom: "80px", background: "var(--surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <p className="section-head">County Risk Atlas</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.1 }}>
              47 Counties Ranked by{" "}
              <em style={{ color: "var(--amber)", fontStyle: "italic" }}>{DIM_OPTIONS.find(d => d.key === dim)?.label}</em>
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search county…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: "160px", padding: "8px 12px", fontSize: "13px" }}
            />
            <select value={dim} onChange={(e) => setDim(e.target.value as Dim)}
              style={{ width: "180px", padding: "8px 12px", fontSize: "13px" }}>
              {DIM_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
            <div style={{ display: "flex", border: "0.5px solid var(--border-md)", borderRadius: "6px", overflow: "hidden" }}>
              {(["bars", "table"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: "8px 14px", fontSize: "12px", fontWeight: 500,
                  background: view === v ? "var(--amber)" : "transparent",
                  color: view === v ? "#1a0e00" : "var(--muted)",
                  border: "none", cursor: "pointer", textTransform: "capitalize",
                }}>
                  {v === "bars" ? "Chart" : "Table"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart view */}
        {view === "bars" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {sorted.slice(0, 47).map((c, i) => {
              const val = c[dim] as number;
              const pct = (val / maxVal) * 100;
              const color = dim === "hfvs" ? getRiskColor(c.hfvs) : DIM_COLORS[dim];
              return (
                <div key={c.id} onClick={() => setSelected(c)} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  cursor: "pointer", padding: "5px 8px", borderRadius: "6px",
                  transition: "background 0.15s",
                }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                   onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ width: "22px", textAlign: "right", fontSize: "11px", color: "var(--dim)", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ width: "120px", fontSize: "13px", flexShrink: 0, whiteSpace: "nowrap" }}>
                    {c.name}
                  </div>
                  <div style={{ flex: 1, position: "relative", height: "18px" }}>
                    <div style={{
                      position: "absolute", left: 0, top: 3, bottom: 3,
                      width: `${pct}%`, background: color, borderRadius: "3px",
                      opacity: 0.8, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                    }} />
                  </div>
                  <div style={{ width: "55px", textAlign: "right", fontFamily: "monospace", fontSize: "13px", fontWeight: 600, color }}>
                    {val.toFixed(3)}
                  </div>
                  <div style={{ width: "80px", textAlign: "right" }}>
                    {dim === "hfvs" && <RiskBadge hfvs={c.hfvs} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table view */}
        {view === "table" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid var(--border-md)" }}>
                  {["#", "County", "HFVS", "Fin. Stress", "Tenure", "Hazard", "Dwelling", "Utility", "% High", "% Urban", "n"].map((h) => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: h === "#" || h === "n" ? "center" : "left",
                                         fontSize: "10px", color: "var(--muted)", fontWeight: 600,
                                         letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((c, i) => (
                  <tr key={c.id} onClick={() => setSelected(c)} style={{
                    borderBottom: "0.5px solid var(--border)", cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "9px 10px", textAlign: "center", color: "var(--dim)" }}>{i + 1}</td>
                    <td style={{ padding: "9px 10px", fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: "9px 10px", fontFamily: "monospace", color: getRiskColor(c.hfvs), fontWeight: 700 }}>{c.hfvs.toFixed(3)}</td>
                    {(["d1","d2","d3","d4","d5"] as const).map((k) => (
                      <td key={k} style={{ padding: "9px 10px", fontFamily: "monospace", color: "var(--muted)" }}>{(c[k] as number).toFixed(3)}</td>
                    ))}
                    <td style={{ padding: "9px 10px", fontFamily: "monospace" }}>{(c.pct_high * 100).toFixed(0)}%</td>
                    <td style={{ padding: "9px 10px", fontFamily: "monospace", color: "var(--muted)" }}>{(c.pct_urban * 100).toFixed(0)}%</td>
                    <td style={{ padding: "9px 10px", textAlign: "center", color: "var(--muted)" }}>{c.n_households}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "24px" }}>
          {[
            { col: "var(--red)", label: `High vulnerability (HFVS > ${(NATIONAL.mean + NATIONAL.sd).toFixed(3)})` },
            { col: "var(--amber)", label: `Above mean (> ${NATIONAL.mean.toFixed(3)})` },
            { col: "var(--teal)", label: "Below mean" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--muted)" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: l.col }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {selected && <CountyModal county={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
